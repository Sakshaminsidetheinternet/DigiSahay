package in.abnv.civic_platform_backend.users.dto;

import in.abnv.civic_platform_backend.users.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDto {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private String token;
}
