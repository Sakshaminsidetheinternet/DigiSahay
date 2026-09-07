package in.abnv.civic_platform_backend.ai.service;

import in.abnv.civic_platform_backend.ai.dto.AiAnalysisResponseDto;
import in.abnv.civic_platform_backend.ai.dto.DuplicateProblemAnalysisDto;
import in.abnv.civic_platform_backend.ai.model.Severity;
import in.abnv.civic_platform_backend.civicproblems.entity.CivicProblem;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.6-flash}")
    private String modelName;

    private final ObjectMapper objectMapper;
    private final RestClient restClient = RestClient.create();

    private String getGeminiApiUrl() {
        String m = (modelName != null && !modelName.isBlank()) ? modelName.trim() : "gemini-3.6-flash";
        return "https://generativelanguage.googleapis.com/v1beta/models/" + m + ":generateContent";
    }


    /**
     * Analyzes and validates a reported civic issue using Gemini AI.
     * Evaluates text and image content for civic validity, categorization,
     * severity, priority, and visual verification.
     */
    public AiAnalysisResponseDto analyzeProblem(
            String title,
            String description,
            ProblemCategory selectedCategoryHint,
            String address,
            String city,
            String urgency,
            MultipartFile image
    ) {
        String prompt = """
                You are the AI validation and classification engine for the DigiSahay civic platform in India.

                Analyze the user's civic report including title, description, citizen category hint, address, city, urgency, and attached image (if provided).
                The citizen's category is STRICTLY a hint. AI is the FINAL authority on the category.

                MULTILINGUAL & GRAMMAR RULES:
                - Understand reports written in English, Hindi (Devanagari or Romanized), Hinglish (e.g., "There is big gadda near school road"), regional Indian phrasing, spelling mistakes, or poor grammar.
                - DO NOT reject or invalidate a genuine civic problem merely because of informal grammar, bad spelling, or Hinglish.

                CANONICAL CATEGORIES (Choose the most accurate):
                - ROAD_DAMAGE (potholes, cave-ins, cracked roads, damaged pavements, broken speed breakers)
                - WATER_MANAGEMENT (water supply shortage, pipeline bursts, water leakage, contaminated drinking water, drainage block)
                - SANITATION (open sewage, choked drains, dirty public toilets, foul water overflow)
                - GARBAGE (uncollected waste, overflowing dumpsters, trash heaps, debris, open dumping)
                - STREETLIGHT (broken or non-functional streetlights, dark lanes, faulty electrical poles)
                - HEALTHCARE (deficiencies in public health centers, lack of medicines, vector breeding/dengue risk)
                - EDUCATION (broken infrastructure in government schools/colleges)
                - AGRICULTURE (irrigation canal breaches, community farming water supply issues)
                - ENVIRONMENT (illegal tree cutting, industrial smoke pollution, pond/river dumping)
                - ENERGY (public power outages, transformer sparks, dangerous sagging high-tension wires)
                - URBAN_DEVELOPMENT (encroachments, broken footpaths, public park maintenance)
                - ACCESSIBILITY (missing ramps for disabled persons at public facilities)
                - PUBLIC_ADMINISTRATION (damaged public boards, community center maintenance)
                - OTHER (other community-level public issues)

                VALIDATION RULES:
                1. isPersonal: Set to true if the complaint is a personal, private, or household issue (e.g., "My ceiling fan is broken", "My washing machine is not working", "Water leakage inside my bedroom", "My private electric bill is incorrect", private boundary dispute). Set isValid=false, isPublic=false.
                2. isVague: Set to true ONLY if there is not enough actionable information or location to understand what or where the issue is (e.g., "Road is bad", "Help please"). If the report gives a specific actionable location and problem, it is NOT vague.
                3. isAbusive: Set to true if report contains abuse, profanity, harassment, or spam.
                4. isIrrelevant: Set to true for non-civic topics, commercial ads, jokes, or personal requests.
                5. isPublic: Set to true ONLY if it affects a street, neighborhood, public utility, community infrastructure, or public service.
                6. isValid: Set to true ONLY if isPublic=true AND isPersonal=false AND isVague=false AND isAbusive=false AND isIrrelevant=false.

                SEVERITY & PRIORITY:
                - severity: LOW, MEDIUM, HIGH, CRITICAL based on safety, health hazard, population affected.
                - priority: Integer between 0 and 100 reflecting urgency, public danger, severity, and community impact.

                IMAGE VERIFICATION (CRITICAL):
                - If an image is provided:
                  Inspect the ACTUAL VISUAL CONTENT of the image.
                  Compare IMAGE content with TITLE, DESCRIPTION, and AI CATEGORY.
                  - If the image visibly corresponds to the reported civic problem (e.g., photo of a pothole for a road problem, overflowing garbage for a waste problem):
                    imageVerified=true, imageConfidence=80-99, imageReason="Visual evidence confirms the reported problem."
                  - If the image is unrelated, irrelevant, or inappropriate (e.g., a selfie, picture of a bedroom, celebrity, meme, animal, food, document) and does not show the reported civic problem:
                    imageVerified=false, imageConfidence=85-99, imageReason="The image does not depict the reported civic problem."
                - If NO image is provided:
                  imageVerified=null, imageConfidence=null, imageReason=null. (Do NOT reject a valid problem merely because there is no image).

                OUTPUT FORMAT:
                Return ONLY valid JSON with this exact structure:
                {
                  "isValid": true,
                  "isVague": false,
                  "isPersonal": false,
                  "isPublic": true,
                  "isAbusive": false,
                  "isIrrelevant": false,
                  "category": "ROAD_DAMAGE",
                  "subCategory": "POTHOLE",
                  "severity": "HIGH",
                  "priority": 85,
                  "confidence": 94.0,
                  "imageVerified": true,
                  "imageConfidence": 92.0,
                  "imageReason": "The image visibly shows a pothole matching the reported road problem.",
                  "reason": "The report describes a public road problem affecting residents.",
                  "responseMessage": "The problem has been identified as a road damage issue."
                }

                REPORT DETAILS TO EVALUATE:
                Title: %s
                Description: %s
                Citizen Category Hint: %s
                Address/Ward: %s
                City: %s
                Urgency Hint: %s
                Has Attached Image: %s
                """.formatted(
                title != null ? title : "",
                description != null ? description : "",
                selectedCategoryHint != null ? selectedCategoryHint.name() : "NONE",
                address != null ? address : "",
                city != null ? city : "",
                urgency != null ? urgency : "NORMAL",
                (image != null && !image.isEmpty()) ? "YES" : "NO"
        );

        try {
            String base64Image = null;
            String mimeType = null;

            if (image != null && !image.isEmpty()) {
                base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                mimeType = image.getContentType();
                if (mimeType == null || !mimeType.startsWith("image/")) {
                    mimeType = "image/jpeg";
                }
            }

            Map<String, Object> textPart = Map.of("text", prompt);
            Object requestBody;

            if (base64Image != null) {
                Map<String, Object> imagePart = Map.of(
                        "inlineData", Map.of(
                                "mimeType", mimeType,
                                "data", base64Image
                        )
                );
                requestBody = Map.of(
                        "contents", new Object[]{
                                Map.of("parts", new Object[]{textPart, imagePart})
                        },
                        "generationConfig", Map.of(
                                "responseMimeType", "application/json"
                        )
                );
            } else {
                requestBody = Map.of(
                        "contents", new Object[]{
                                Map.of("parts", new Object[]{textPart})
                        },
                        "generationConfig", Map.of(
                                "responseMimeType", "application/json"
                        )
                );
            }

            String response = restClient.post()
                    .uri(getGeminiApiUrl())
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return parseAiAnalysisResponse(response, selectedCategoryHint);

        } catch (Exception e) {
            log.error("Gemini AI analysis error: {}", e.getMessage(), e);
            throw new RuntimeException("AI analysis is temporarily unavailable. Please try again.", e);
        }
    }

    /**
     * Evaluates whether a new problem statement is a semantic duplicate of
     * existing candidate problems in the same city.
     */
    public DuplicateProblemAnalysisDto detectDuplicateProblem(
            String title,
            String description,
            String address,
            String city,
            ProblemCategory category,
            List<CivicProblem> candidateProblems
    ) {
        if (candidateProblems == null || candidateProblems.isEmpty()) {
            return DuplicateProblemAnalysisDto.builder()
                    .duplicate(false)
                    .duplicateProblemId(null)
                    .confidence(0.0)
                    .reason("No existing candidate problems found in this area.")
                    .build();
        }

        StringBuilder candidatesText = new StringBuilder();
        for (CivicProblem p : candidateProblems) {
            candidatesText.append("""
                    ---
                    Candidate Problem ID: %d
                    Title: %s
                    Description: %s
                    Category: %s
                    Address/Location: %s
                    City: %s
                    
                    """.formatted(
                    p.getId(),
                    p.getTitle(),
                    p.getDescription(),
                    p.getCategory() != null ? p.getCategory().name() : "OTHER",
                    p.getAddress(),
                    p.getCity()
            ));
        }

        String prompt = """
                You are an AI duplicate detection engine for DigiSahay civic platform in India.

                Determine if the NEW REPORT is describing the EXACT SAME real-world civic problem as one of the EXISTING CANDIDATES.

                CRITICAL LOCATION & CONTEXT RULES:
                - ONE REAL-WORLD ISSUE = ONE CANONICAL CIVIC PROBLEM.
                - Location is CRITICAL. Two potholes in different parts of the same city (e.g. "Pothole near ABC School" vs "Pothole near Railway Station") are SEPARATE problems and MUST NOT be merged.
                - However, different descriptions of the SAME physical issue in the same vicinity (e.g., "Large pothole outside ABC School on Main Road" vs "Big gaddha near ABC school") MUST be recognized as duplicate.
                - Understand language variations: English, Hindi, Hinglish ("gadda", "kachra", "pani", etc.).

                NEW REPORT:
                Title: %s
                Description: %s
                Category: %s
                Address/Location: %s
                City: %s

                EXISTING CANDIDATES:
                %s

                Return ONLY valid JSON matching:
                {
                  "isDuplicate": true,
                  "existingProblemId": 101,
                  "confidence": 94.0,
                  "reason": "Both reports describe the same pothole near ABC School on Main Road."
                }
                If no candidate describes the same issue:
                {
                  "isDuplicate": false,
                  "existingProblemId": null,
                  "confidence": 0.0,
                  "reason": "Describes a different problem or different location."
                }
                """.formatted(
                title != null ? title : "",
                description != null ? description : "",
                category != null ? category.name() : "OTHER",
                address != null ? address : "",
                city != null ? city : "",
                candidatesText.toString()
        );

        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[]{
                            Map.of("parts", new Object[]{Map.of("text", prompt)})
                    },
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json"
                    )
            );

            String response = restClient.post()
                    .uri(getGeminiApiUrl())
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return parseDuplicateResponse(response);

        } catch (Exception e) {
            log.warn("Gemini duplicate detection failed: {}", e.getMessage());
            return DuplicateProblemAnalysisDto.builder()
                    .duplicate(false)
                    .duplicateProblemId(null)
                    .confidence(0.0)
                    .reason("Duplicate detection unavailable; proceeding as new.")
                    .build();
        }
    }

    private AiAnalysisResponseDto parseAiAnalysisResponse(String rawResponse, ProblemCategory hint) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            String aiText = extractAiText(root);
            String cleanJson = stripMarkdownCodeBlocks(aiText);

            JsonNode node = objectMapper.readTree(cleanJson);

            boolean isValid = node.path("isValid").asBoolean(true);
            boolean isVague = node.path("isVague").asBoolean(false);
            boolean isPersonal = node.path("isPersonal").asBoolean(false);
            boolean isPublic = node.path("isPublic").asBoolean(!isPersonal);
            boolean isAbusive = node.path("isAbusive").asBoolean(false);
            boolean isIrrelevant = node.path("isIrrelevant").asBoolean(false);

            String categoryStr = node.has("category") ? node.get("category").asText() :
                    (node.has("suggestedCategory") ? node.get("suggestedCategory").asText() : null);
            ProblemCategory finalCategory = ProblemCategory.fromString(categoryStr != null ? categoryStr : (hint != null ? hint.name() : "OTHER"));

            String subCategory = node.path("subCategory").asText(null);

            String severityStr = node.path("severity").asText("MEDIUM").toUpperCase();
            Severity severity;
            try {
                severity = Severity.valueOf(severityStr);
            } catch (Exception ex) {
                severity = Severity.MEDIUM;
            }

            int priority = node.path("priority").asInt(60);
            priority = Math.max(0, Math.min(100, priority));

            double confidence = node.path("confidence").asDouble(85.0);
            confidence = Math.max(0.0, Math.min(100.0, confidence));

            Boolean imageVerified = null;
            Double imageConfidence = null;
            String imageReason = null;

            if (node.hasNonNull("imageVerified")) {
                imageVerified = node.get("imageVerified").asBoolean();
                if (node.hasNonNull("imageConfidence")) {
                    imageConfidence = node.get("imageConfidence").asDouble();
                }
                if (node.hasNonNull("imageReason")) {
                    imageReason = node.get("imageReason").asText();
                } else if (node.hasNonNull("imageVerificationReason")) {
                    imageReason = node.get("imageVerificationReason").asText();
                }
            }

            String reason = node.path("reason").asText("");
            String responseMessage = node.path("responseMessage").asText(reason);

            return AiAnalysisResponseDto.builder()
                    .isValid(isValid)
                    .isVague(isVague)
                    .isPersonal(isPersonal)
                    .isPublic(isPublic)
                    .isAbusive(isAbusive)
                    .isIrrelevant(isIrrelevant)
                    .suggestedCategory(finalCategory)
                    .subCategory(subCategory)
                    .severity(severity)
                    .priority(priority)
                    .confidence(confidence)
                    .imageVerified(imageVerified)
                    .imageConfidence(imageConfidence)
                    .imageReason(imageReason)
                    .reason(reason)
                    .responseMessage(responseMessage)
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse AI analysis output: {}", e.getMessage(), e);
            throw new RuntimeException("AI analysis parsing failed", e);
        }
    }

    private DuplicateProblemAnalysisDto parseDuplicateResponse(String rawResponse) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            String aiText = extractAiText(root);
            String cleanJson = stripMarkdownCodeBlocks(aiText);

            JsonNode node = objectMapper.readTree(cleanJson);

            boolean isDuplicate = node.path("isDuplicate").asBoolean(node.path("duplicate").asBoolean(false));
            Long problemId = null;
            if (node.hasNonNull("existingProblemId")) {
                problemId = node.get("existingProblemId").asLong();
            } else if (node.hasNonNull("duplicateProblemId")) {
                problemId = node.get("duplicateProblemId").asLong();
            }

            double confidence = node.path("confidence").asDouble(0.0);
            String reason = node.path("reason").asText("");

            return DuplicateProblemAnalysisDto.builder()
                    .duplicate(isDuplicate && problemId != null && confidence >= 70.0)
                    .duplicateProblemId(problemId)
                    .confidence(confidence)
                    .reason(reason)
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse duplicate detection output: {}", e.getMessage(), e);
            return DuplicateProblemAnalysisDto.builder()
                    .duplicate(false)
                    .duplicateProblemId(null)
                    .confidence(0.0)
                    .reason("Could not verify duplicate: " + e.getMessage())
                    .build();
        }
    }

    private String extractAiText(JsonNode root) {
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && candidates.size() > 0) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray()) {
                for (JsonNode part : parts) {
                    if (part.has("text") && !part.get("text").asText().isBlank()) {
                        return part.get("text").asText();
                    }
                }
            }
        }
        return "";
    }

    private String stripMarkdownCodeBlocks(String text) {
        if (text == null) return "{}";
        String trimmed = text.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        trimmed = trimmed.trim();
        int firstBrace = trimmed.indexOf('{');
        int lastBrace = trimmed.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            return trimmed.substring(firstBrace, lastBrace + 1);
        }
        return trimmed;
    }
}
