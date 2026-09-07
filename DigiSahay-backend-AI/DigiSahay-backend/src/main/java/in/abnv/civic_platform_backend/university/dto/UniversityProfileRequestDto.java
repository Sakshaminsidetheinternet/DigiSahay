package in.abnv.civic_platform_backend.university.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UniversityProfileRequestDto {

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
}
