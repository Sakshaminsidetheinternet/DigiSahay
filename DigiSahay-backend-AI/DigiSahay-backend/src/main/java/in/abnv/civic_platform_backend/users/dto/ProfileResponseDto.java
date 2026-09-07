package in.abnv.civic_platform_backend.users.dto;

import in.abnv.civic_platform_backend.users.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class ProfileResponseDto {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private Integer age;

    private String phone;

    private String street;

    private String city;

    private String state;

    private String pinCode;

    private LocalDateTime createdAt;

    // Only populated when the update caused the email (JWT subject) to change,
    // so the frontend can swap in the new token without forcing a re-login.
    private String token;
}

