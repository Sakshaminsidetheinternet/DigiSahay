package in.abnv.civic_platform_backend.university.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class UniversityProfileResponseDto {

    private Long id;

    // Pulled from the underlying User, not the university_profiles table.
    private String name;

    private String email;

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
    private String expertise;

    private LocalDateTime createdAt;
}
