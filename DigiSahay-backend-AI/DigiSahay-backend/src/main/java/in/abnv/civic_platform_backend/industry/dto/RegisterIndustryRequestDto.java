package in.abnv.civic_platform_backend.industry.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterIndustryRequestDto {

    @NotBlank(message = "Company name cannot be empty")
    private String companyName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Please enter a valid email")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
