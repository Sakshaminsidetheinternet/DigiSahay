package in.abnv.civic_platform_backend.ai.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class DuplicateProblemAnalysisDto {

    @JsonAlias({"duplicate", "isDuplicate"})
    private Boolean duplicate;

    @JsonAlias({"duplicateProblemId", "existingProblemId", "problemId"})
    private Long duplicateProblemId;

    private Double confidence;

    private String reason;
}
