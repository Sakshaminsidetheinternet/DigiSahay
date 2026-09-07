package in.abnv.civic_platform_backend.proposals.service;

import in.abnv.civic_platform_backend.civicproblems.entity.CivicProblem;
import in.abnv.civic_platform_backend.civicproblems.repository.CivicProblemRepository;
import in.abnv.civic_platform_backend.proposals.dto.ProposalResponseDto;
import in.abnv.civic_platform_backend.proposals.entity.Proposal;
import in.abnv.civic_platform_backend.proposals.repository.ProposalRepository;
import in.abnv.civic_platform_backend.storage.FileStorageService;
import in.abnv.civic_platform_backend.university.entity.University;
import in.abnv.civic_platform_backend.university.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final ProposalRepository proposals;
    private final CivicProblemRepository problems;
    private final UniversityRepository universities;
    private final FileStorageService files;

    public ProposalResponseDto create(
            Long universityId,
            Long problemId,
            String solutionTitle,
            String mentor,
            String studentTeam,
            String trlLevel,
            String fundingRequired,
            MultipartFile pdf
    ) {
        University u = universities.findById(universityId)
                .orElseThrow(() -> new RuntimeException("University not found"));
        CivicProblem p = problems.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        String url = null;
        if (pdf != null && !pdf.isEmpty()) {
            url = files.saveProposalFile(pdf);
        }

        Proposal x = proposals.save(Proposal.builder()
                .university(u)
                .problem(p)
                .solutionTitle(solutionTitle)
                .mentor(mentor)
                .studentTeam(studentTeam)
                .trlLevel(trlLevel)
                .fundingRequired(fundingRequired)
                .pdfUrl(url)
                .build());

        return dto(x);
    }

    public List<ProposalResponseDto> all() {
        return proposals.findAll().stream().map(this::dto).toList();
    }

    public List<ProposalResponseDto> byUniversity(Long id) {
        return proposals.findByUniversityId(id).stream().map(this::dto).toList();
    }

    public List<ProposalResponseDto> byProblem(Long id) {
        return proposals.findByProblemId(id).stream().map(this::dto).toList();
    }

    private ProposalResponseDto dto(Proposal p) {
        CivicProblem prob = p.getProblem();
        String loc = "";
        if (prob != null) {
            String addr = prob.getAddress() != null ? prob.getAddress().trim() : "";
            String city = prob.getCity() != null ? prob.getCity().trim() : "";
            if (!addr.isEmpty() && !city.isEmpty()) loc = addr + " · " + city;
            else loc = !addr.isEmpty() ? addr : city;
        }

        return ProposalResponseDto.builder()
                .id(p.getId())
                .problemId(prob != null ? prob.getId() : null)
                .problemTitle(prob != null ? prob.getTitle() : null)
                .category(prob != null ? prob.getCategory() : null)
                .subCategory(prob != null ? prob.getAiSubCategory() : null)
                .location(loc)
                .priority(prob != null ? prob.getPriority() : null)
                .reportCount(prob != null ? (prob.getReportCount() != null ? prob.getReportCount() : 1) : 1)
                .universityId(p.getUniversity() != null ? p.getUniversity().getId() : null)
                .universityName(p.getUniversity() != null ? p.getUniversity().getName() : null)
                .solutionTitle(p.getSolutionTitle())
                .mentor(p.getMentor())
                .studentTeam(p.getStudentTeam())
                .pdfUrl(p.getPdfUrl())
                .trlLevel(p.getTrlLevel())
                .fundingRequired(p.getFundingRequired())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
