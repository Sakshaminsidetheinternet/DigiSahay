package in.abnv.civic_platform_backend.civicproblems.entity;


import in.abnv.civic_platform_backend.ai.model.Severity;
import in.abnv.civic_platform_backend.users.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "civic_problems")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CivicProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private ProblemCategory category;

    @Enumerated(EnumType.STRING)
    private ProblemStatus status;

    private String address;

    private String city;

    private Double latitude;
    private Double longitude;
    private Integer upvotes;

    @Column
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    private Boolean imageVerified;

    private Double aiConfidence;

    private Boolean aiValid;
    private Boolean aiVague;
    private Boolean aiPersonal;
    private Boolean aiPublic;
    private Boolean aiAbusive;
    private Boolean aiIrrelevant;

    @Column(length = 1000)
    private String aiReason;

    @Enumerated(EnumType.STRING)
    private ProblemCategory aiSuggestedCategory;

    private String aiSubCategory;

    @Enumerated(EnumType.STRING)
    private Severity aiSeverity;

    private Integer aiPriority;

    private Double imageConfidence;

    @Column(length = 1000)
    private String imageVerificationReason;

    private Integer priority;

    @Builder.Default
    private Integer reportCount = 1;

    private LocalDateTime lastReportedAt;

    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (lastReportedAt == null) {
            lastReportedAt = LocalDateTime.now();
        }

        if (status == null) {
            status = ProblemStatus.OPEN;
        }
        if (upvotes == null) {
            upvotes = 0;
        }
        if (reportCount == null || reportCount < 1) {
            reportCount = 1;
        }
        if (priority == null) {
            priority = aiPriority != null ? aiPriority : 50;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
