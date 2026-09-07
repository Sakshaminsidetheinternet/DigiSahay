package in.abnv.civic_platform_backend.industry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class IndustryProfileResponseDto {

    private Long id;

    // Pulled from the underlying User, not the industry_profiles table.
    private String name;

    private String email;

    private String companyName;

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

    private LocalDateTime createdAt;
}
