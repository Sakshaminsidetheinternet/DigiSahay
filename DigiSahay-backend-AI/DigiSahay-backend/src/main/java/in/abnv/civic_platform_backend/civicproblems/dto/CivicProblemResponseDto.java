package in.abnv.civic_platform_backend.civicproblems.dto;

import in.abnv.civic_platform_backend.ai.model.Severity;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemCategory;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CivicProblemResponseDto {

    private Long id;
    private Long problemId;

    private Boolean created;
    private Boolean duplicate;
    private Long duplicateProblemId;
    private Double duplicateConfidence;
    private String duplicateReason;

    private Integer reportCount;
    private Integer priority;
    private String message;

    private String title;
    private String description;
    private ProblemCategory category;
    private ProblemStatus status;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private Integer upvotes;
    private String imageUrl;

    private ProblemCategory aiSuggestedCategory;
    private String aiSubCategory;
    private Severity severity;
    private Severity aiSeverity;
    private Integer aiPriority;
    private Double aiConfidence;

    private Boolean imageVerified;
    private Double imageConfidence;
    private String imageReason;

    private Boolean aiValid;
    private Boolean aiVague;
    private Boolean aiPersonal;
    private Boolean aiPublic;
    private Boolean aiAbusive;
    private Boolean aiIrrelevant;
    private String aiReason;

    private Long submissionsCount;
    private Long reportedById;
    private String reportedByName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastReportedAt;
}
