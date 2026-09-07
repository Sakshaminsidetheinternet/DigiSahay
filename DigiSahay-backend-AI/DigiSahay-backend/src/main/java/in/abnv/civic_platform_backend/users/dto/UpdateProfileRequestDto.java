package in.abnv.civic_platform_backend.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequestDto {

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Please enter a valid email")
    private String email;

    private Integer age;

    private String phone;

    private String street;

    private String city;

    private String state;

    private String pinCode;
}

