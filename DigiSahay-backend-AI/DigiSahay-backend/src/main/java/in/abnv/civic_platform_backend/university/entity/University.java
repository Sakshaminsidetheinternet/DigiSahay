package in.abnv.civic_platform_backend.university.entity;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.users.entity.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class University implements AuthUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.UNIVERSITIES;

    private String shortName;

    private String dean;

    private String naacGrade;

    private String nirfRank;

    private String established;

    private String street;

    private String sector;

    private String city;

    private String state;

    private String pinCode;

    @Column(length = 1000)
    private String expertise;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = Role.UNIVERSITIES;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

