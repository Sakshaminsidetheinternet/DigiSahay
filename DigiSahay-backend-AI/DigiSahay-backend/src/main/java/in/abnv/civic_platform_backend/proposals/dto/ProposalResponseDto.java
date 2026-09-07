package in.abnv.civic_platform_backend.proposals.dto;

import in.abnv.civic_platform_backend.civicproblems.entity.ProblemCategory;
import in.abnv.civic_platform_backend.proposals.entity.ProposalStatus;
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
public class ProposalResponseDto {
    private Long id;
    private Long problemId;
    private Long universityId;
    private String universityName;
    private String problemTitle;
    private ProblemCategory category;
    private String subCategory;
    private String location;
    private Integer priority;
    private Integer reportCount;
    private String solutionTitle;
    private String mentor;
    private String studentTeam;
    private String pdfUrl;
    private String trlLevel;
    private String fundingRequired;
    private ProposalStatus status;
    private LocalDateTime createdAt;
}
