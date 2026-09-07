package in.abnv.civic_platform_backend.civicproblems.service;

import in.abnv.civic_platform_backend.ai.dto.AiAnalysisResponseDto;
import in.abnv.civic_platform_backend.ai.dto.DuplicateProblemAnalysisDto;
import in.abnv.civic_platform_backend.ai.service.GeminiService;
import in.abnv.civic_platform_backend.civicproblems.dto.CivicProblemResponseDto;
import in.abnv.civic_platform_backend.civicproblems.dto.CreateCivicProblemRequestDto;
import in.abnv.civic_platform_backend.civicproblems.entity.CivicProblem;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemCategory;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemStatus;
import in.abnv.civic_platform_backend.civicproblems.repository.CivicProblemRepository;
import in.abnv.civic_platform_backend.proposals.repository.ProposalRepository;
import in.abnv.civic_platform_backend.storage.FileStorageService;
import in.abnv.civic_platform_backend.university.entity.University;
import in.abnv.civic_platform_backend.university.repository.UniversityRepository;
import in.abnv.civic_platform_backend.users.entity.User;
import in.abnv.civic_platform_backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CivicProblemService {

    private final CivicProblemRepository civicProblemRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final GeminiService geminiService;
    private final UniversityRepository universityRepository;
    private final ProposalRepository proposalRepository;

    private static final int ESCALATION_FACTOR = 5;

    @Transactional
    public CivicProblemResponseDto createProblem(
            CreateCivicProblemRequestDto requestDto,
            MultipartFile image,
            String email
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 1: AI Validation & Classification Pipeline
        AiAnalysisResponseDto aiAnalysis = geminiService.analyzeProblem(
                requestDto.getTitle(),
                requestDto.getDescription(),
                requestDto.getCategory(), // Citizen hint only
                requestDto.getAddress(),
                requestDto.getCity(),
                requestDto.getUrgency(),
                image
        );

        // Validation Rule 1: Personal complaints must be rejected
        if (Boolean.TRUE.equals(aiAnalysis.getIsPersonal())) {
            throw new InvalidCivicProblemException(
                    "This appears to be a personal issue rather than a public/community problem. DigiSahay is designed for civic and community issues.",
                    aiAnalysis
            );
        }

        // Validation Rule 2: Vague reports missing actionable detail or location must be rejected
        if (Boolean.TRUE.equals(aiAnalysis.getIsVague())) {
            throw new InvalidCivicProblemException(
                    "Please provide more details and the location of the problem.",
                    aiAnalysis
            );
        }

        // Validation Rule 3: Abusive, irrelevant, or non-public submissions
        if (Boolean.TRUE.equals(aiAnalysis.getIsAbusive()) || Boolean.TRUE.equals(aiAnalysis.getIsIrrelevant())
                || Boolean.FALSE.equals(aiAnalysis.getIsValid())) {
            String msg = (aiAnalysis.getResponseMessage() != null && !aiAnalysis.getResponseMessage().isBlank())
                    ? aiAnalysis.getResponseMessage()
                    : "This report could not be validated as a public civic problem.";
            throw new InvalidCivicProblemException(msg, aiAnalysis);
        }

        // Validation Rule 4: Multimodal Image Verification
        if (image != null && !image.isEmpty()) {
            if (Boolean.FALSE.equals(aiAnalysis.getImageVerified())) {
                String imgDetail = (aiAnalysis.getImageReason() != null && !aiAnalysis.getImageReason().isBlank())
                        ? aiAnalysis.getImageReason()
                        : "The uploaded image does not appear to match the reported civic problem. Please upload a clear photo of the problem site.";
                throw new InvalidCivicProblemException(
                        "AI image verification failed: " + imgDetail,
                        aiAnalysis
                );
            }
        }

        // AI Category is the final authority
        ProblemCategory finalCategory = aiAnalysis.getSuggestedCategory() != null
                ? aiAnalysis.getSuggestedCategory()
                : (requestDto.getCategory() != null ? requestDto.getCategory() : ProblemCategory.OTHER);

        // Step 2: Two-Stage Duplicate Detection
        // Stage 1: Candidate retrieval by city, canonical category, and active status
        List<CivicProblem> candidates = civicProblemRepository.findDuplicateCandidates(
                requestDto.getCity(),
                finalCategory,
                List.of(ProblemStatus.OPEN, ProblemStatus.IN_PROGRESS)
        );

        // Stage 2: Contextual and semantic similarity via Gemini AI
        DuplicateProblemAnalysisDto duplicateAnalysis = geminiService.detectDuplicateProblem(
                requestDto.getTitle(),
                requestDto.getDescription(),
                requestDto.getAddress(),
                requestDto.getCity(),
                finalCategory,
                candidates
        );

        // If duplicate detected: update canonical record with concurrency protection
        if (Boolean.TRUE.equals(duplicateAnalysis.getDuplicate())
                && duplicateAnalysis.getDuplicateProblemId() != null) {

            Long existingId = duplicateAnalysis.getDuplicateProblemId();
            CivicProblem existing = civicProblemRepository.findByIdForUpdate(existingId).orElse(null);

            if (existing != null) {
                int currentReports = (existing.getReportCount() != null && existing.getReportCount() > 0)
                        ? existing.getReportCount() : 1;
                int newReportCount = currentReports + 1;
                existing.setReportCount(newReportCount);
                existing.setLastReportedAt(LocalDateTime.now());

                // Deterministic priority escalation formula:
                // priority = min(100, baseAiPriority + (reportCount - 1) * escalationFactor)
                int basePriority = existing.getAiPriority() != null
                        ? existing.getAiPriority()
                        : (existing.getPriority() != null ? existing.getPriority() : 60);

                int currentPriority = existing.getPriority() != null ? existing.getPriority() : basePriority;
                int escalatedPriority = Math.min(100, basePriority + (newReportCount - 1) * ESCALATION_FACTOR);
                int finalPriority = Math.max(currentPriority, escalatedPriority); // Never decrease priority

                existing.setPriority(finalPriority);
                CivicProblem updated = civicProblemRepository.save(existing);

                log.info("Duplicate detected for problem ID {}. Escalated priority to {}, reportCount to {}",
                        existing.getId(), finalPriority, newReportCount);

                CivicProblemResponseDto response = toResponse(updated);
                response.setCreated(false);
                response.setDuplicate(true);
                response.setProblemId(updated.getId());
                response.setReportCount(updated.getReportCount());
                response.setPriority(updated.getPriority());
                response.setDuplicateConfidence(duplicateAnalysis.getConfidence());
                response.setDuplicateReason(duplicateAnalysis.getReason());
                response.setMessage("This problem has already been reported. Your report has been added to the existing issue and its priority has been increased.");
                return response;
            }
        }

        // Step 3: Create New Canonical Civic Problem
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.saveFile(image);
        }

        int basePriority = aiAnalysis.getPriority() != null ? aiAnalysis.getPriority() : 60;

        CivicProblem problem = CivicProblem.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .category(finalCategory)
                .status(ProblemStatus.OPEN)
                .address(requestDto.getAddress())
                .city(requestDto.getCity())
                .latitude(requestDto.getLatitude())
                .longitude(requestDto.getLongitude())
                .upvotes(0)
                .imageUrl(imageUrl)
                .severity(aiAnalysis.getSeverity())
                .aiSeverity(aiAnalysis.getSeverity())
                .aiPriority(basePriority)
                .priority(basePriority)
                .reportCount(1)
                .lastReportedAt(LocalDateTime.now())
                .imageVerified(aiAnalysis.getImageVerified())
                .imageConfidence(aiAnalysis.getImageConfidence())
                .imageVerificationReason(aiAnalysis.getImageReason())
                .aiSuggestedCategory(finalCategory)
                .aiSubCategory(aiAnalysis.getSubCategory())
                .aiConfidence(aiAnalysis.getConfidence())
                .aiValid(aiAnalysis.getIsValid())
                .aiVague(aiAnalysis.getIsVague())
                .aiPersonal(aiAnalysis.getIsPersonal())
                .aiPublic(aiAnalysis.getIsPublic())
                .aiAbusive(aiAnalysis.getIsAbusive())
                .aiIrrelevant(aiAnalysis.getIsIrrelevant())
                .aiReason(aiAnalysis.getReason())
                .reportedBy(user)
                .build();

        CivicProblem savedProblem = civicProblemRepository.save(problem);

        CivicProblemResponseDto response = toResponse(savedProblem);
        response.setCreated(true);
        response.setDuplicate(false);
        response.setProblemId(savedProblem.getId());
        response.setReportCount(1);
        response.setPriority(savedProblem.getPriority());
        response.setMessage("Problem reported successfully.");
        return response;
    }

    public List<CivicProblemResponseDto> getAllProblems() {
        return civicProblemRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CivicProblemResponseDto getProblemById(Long id) {
        CivicProblem problem = civicProblemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        return toResponse(problem);
    }

    public List<CivicProblemResponseDto> getMyProblems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return civicProblemRepository.findByReportedById(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * University Routing: returns problems routed strictly to this university
     * based on its registered expertise categories. If expertise is empty, returns empty list.
     */
    public List<CivicProblemResponseDto> getRecommendedProblems(Long universityId) {
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new RuntimeException("University not found"));

        String expertise = university.getExpertise();
        if (expertise == null || expertise.trim().isEmpty()) {
            return List.of();
        }

        Set<ProblemCategory> allowedCategories = Arrays.stream(expertise.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(ProblemCategory::fromString)
                .collect(Collectors.toSet());

        if (allowedCategories.isEmpty()) {
            return List.of();
        }

        return civicProblemRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && allowedCategories.contains(p.getCategory()))
                .filter(p -> p.getStatus() != ProblemStatus.RESOLVED && p.getStatus() != ProblemStatus.REJECTED)
                .map(this::toResponse)
                .toList();
    }

    public CivicProblemResponseDto toResponse(CivicProblem problem) {
        int reportCount = problem.getReportCount() != null ? problem.getReportCount() : 1;
        int priority = problem.getPriority() != null ? problem.getPriority()
                : (problem.getAiPriority() != null ? problem.getAiPriority() : 60);

        return CivicProblemResponseDto.builder()
                .id(problem.getId())
                .problemId(problem.getId())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .category(problem.getCategory())
                .status(problem.getStatus())
                .address(problem.getAddress())
                .city(problem.getCity())
                .latitude(problem.getLatitude())
                .longitude(problem.getLongitude())
                .upvotes(problem.getUpvotes() != null ? problem.getUpvotes() : 0)
                .imageUrl(problem.getImageUrl())
                .aiSuggestedCategory(problem.getAiSuggestedCategory())
                .aiSubCategory(problem.getAiSubCategory())
                .severity(problem.getSeverity())
                .aiSeverity(problem.getAiSeverity())
                .priority(priority)
                .aiPriority(problem.getAiPriority())
                .reportCount(reportCount)
                .lastReportedAt(problem.getLastReportedAt())
                .imageVerified(problem.getImageVerified())
                .imageConfidence(problem.getImageConfidence())
                .imageReason(problem.getImageVerificationReason())
                .aiConfidence(problem.getAiConfidence())
                .reportedById(problem.getReportedBy() != null ? problem.getReportedBy().getId() : null)
                .reportedByName(problem.getReportedBy() != null ? problem.getReportedBy().getName() : "Citizen")
                .createdAt(problem.getCreatedAt())
                .updatedAt(problem.getUpdatedAt())
                .aiValid(problem.getAiValid())
                .aiVague(problem.getAiVague())
                .aiPersonal(problem.getAiPersonal())
                .aiPublic(problem.getAiPublic())
                .aiAbusive(problem.getAiAbusive())
                .aiIrrelevant(problem.getAiIrrelevant())
                .aiReason(problem.getAiReason())
                .submissionsCount(proposalRepository.countByProblemId(problem.getId()))
                .build();
    }
}
