package in.abnv.civic_platform_backend.proposals.entity;

import in.abnv.civic_platform_backend.civicproblems.entity.CivicProblem;
import in.abnv.civic_platform_backend.university.entity.University;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="proposals")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Proposal {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private CivicProblem problem;
 @ManyToOne(optional=false) private University university;
 @Column(nullable=false) private String solutionTitle;
 @Column(length=1000) private String mentor;
 @Column(length=2000) private String studentTeam;
 private String pdfUrl;
 @Enumerated(EnumType.STRING) private ProposalStatus status;
 private String trlLevel;
 private String fundingRequired;
 private LocalDateTime createdAt;
 @PrePersist void onCreate(){ if(status==null) status=ProposalStatus.SUBMITTED; createdAt=LocalDateTime.now(); }
}
