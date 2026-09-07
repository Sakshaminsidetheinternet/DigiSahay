package in.abnv.civic_platform_backend.users.controller;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.users.dto.LoginRequestDto;
import in.abnv.civic_platform_backend.users.dto.LoginResponseDto;
import in.abnv.civic_platform_backend.users.dto.ProfileResponseDto;
import in.abnv.civic_platform_backend.users.dto.RegisterUserRequestDto;
import in.abnv.civic_platform_backend.users.dto.UpdateProfileRequestDto;
import in.abnv.civic_platform_backend.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthUser> registerUser(@Valid @RequestBody RegisterUserRequestDto requestDto) {
        AuthUser user = userService.registerUser(requestDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }

    @PostMapping("/login")
    public LoginResponseDto loginUser(@RequestBody LoginRequestDto loginRequestDto) {
        return userService.loginUser(loginRequestDto);
    }

    @GetMapping("/profile")
    public ProfileResponseDto getProfile(@AuthenticationPrincipal AuthUser currentUser) {
        return userService.getProfile(currentUser);
    }

    @PutMapping("/profile")
    public ProfileResponseDto updateProfile(
            @AuthenticationPrincipal AuthUser currentUser,
            @Valid @RequestBody UpdateProfileRequestDto requestDto
    ) {
        return userService.updateProfile(currentUser, requestDto);
    }
}
