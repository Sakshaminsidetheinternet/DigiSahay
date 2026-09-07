package in.abnv.civic_platform_backend.industry.entity;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.users.entity.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "industries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Industry implements AuthUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.INDUSTRY;

    private String shortName;

    private String sector;

    private String nodalOfficer;

    private String designation;

    private String cin;

    private String established;

    private String street;

    private String sectorArea;

    private String city;

    private String state;

    private String pinCode;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Override
    public String getName() {
        return this.companyName;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = Role.INDUSTRY;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

