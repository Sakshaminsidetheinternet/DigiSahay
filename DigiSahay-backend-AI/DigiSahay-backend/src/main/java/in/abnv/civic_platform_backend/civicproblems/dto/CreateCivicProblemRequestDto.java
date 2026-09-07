package in.abnv.civic_platform_backend.civicproblems.dto;

import in.abnv.civic_platform_backend.civicproblems.entity.ProblemCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CreateCivicProblemRequestDto {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    // Optional citizen hint. AI always makes the final category decision.
    private ProblemCategory category;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotBlank(message = "City cannot be empty")
    private String city;

    private Double latitude;

    private Double longitude;

    private String urgency;
}
