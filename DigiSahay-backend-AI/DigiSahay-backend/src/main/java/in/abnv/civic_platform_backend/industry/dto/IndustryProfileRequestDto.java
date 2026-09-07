package in.abnv.civic_platform_backend.industry.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IndustryProfileRequestDto {

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
}
