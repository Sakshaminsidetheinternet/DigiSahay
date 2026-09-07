package in.abnv.civic_platform_backend.university.controller;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.university.dto.RegisterUniversityRequestDto;
import in.abnv.civic_platform_backend.university.dto.UniversityProfileRequestDto;
import in.abnv.civic_platform_backend.university.dto.UniversityProfileResponseDto;
import in.abnv.civic_platform_backend.university.entity.University;
import in.abnv.civic_platform_backend.university.service.UniversityProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/university")
@RequiredArgsConstructor
public class UniversityProfileController {

    private final UniversityProfileService universityProfileService;

    @PostMapping("/register")
    public ResponseEntity<University> registerUniversity(@Valid @RequestBody RegisterUniversityRequestDto requestDto) {
        University university = universityProfileService.registerUniversity(requestDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(university);
    }

    @GetMapping("/profile")
    public UniversityProfileResponseDto getProfile(@AuthenticationPrincipal AuthUser currentUser) {
        return universityProfileService.getProfile(currentUser);
    }

    @PutMapping("/profile")
    public UniversityProfileResponseDto updateProfile(
            @AuthenticationPrincipal AuthUser currentUser,
            @RequestBody UniversityProfileRequestDto requestDto
    ) {
        return universityProfileService.updateProfile(currentUser, requestDto);
    }
}
