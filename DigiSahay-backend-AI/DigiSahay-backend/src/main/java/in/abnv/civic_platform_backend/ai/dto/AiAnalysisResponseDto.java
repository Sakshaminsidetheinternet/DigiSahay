package in.abnv.civic_platform_backend.ai.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import in.abnv.civic_platform_backend.ai.model.Severity;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiAnalysisResponseDto {

    @JsonAlias({"category", "suggestedCategory"})
    private ProblemCategory suggestedCategory;

    private String subCategory;

    private Severity severity;

    private Integer priority;

    private Double confidence;

    private Boolean isValid;
    private Boolean isVague;
    private Boolean isPersonal;
    private Boolean isPublic;
    private Boolean isAbusive;
    private Boolean isIrrelevant;

    private Boolean imageVerified;
    private Double imageConfidence;

    @JsonAlias({"imageReason", "imageVerificationReason"})
    private String imageReason;

    private String reason;
    private String responseMessage;
}
