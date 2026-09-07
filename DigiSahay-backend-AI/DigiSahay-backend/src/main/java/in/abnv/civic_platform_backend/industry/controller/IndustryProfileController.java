package in.abnv.civic_platform_backend.industry.controller;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.industry.dto.IndustryProfileRequestDto;
import in.abnv.civic_platform_backend.industry.dto.IndustryProfileResponseDto;
import in.abnv.civic_platform_backend.industry.dto.RegisterIndustryRequestDto;
import in.abnv.civic_platform_backend.industry.entity.Industry;
import in.abnv.civic_platform_backend.industry.service.IndustryProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/industry")
@RequiredArgsConstructor
public class IndustryProfileController {

    private final IndustryProfileService industryProfileService;

    @PostMapping("/register")
    public ResponseEntity<Industry> registerIndustry(@Valid @RequestBody RegisterIndustryRequestDto requestDto) {
        Industry industry = industryProfileService.registerIndustry(requestDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(industry);
    }

    @GetMapping("/profile")
    public IndustryProfileResponseDto getProfile(@AuthenticationPrincipal AuthUser currentUser) {
        return industryProfileService.getProfile(currentUser);
    }

    @PutMapping("/profile")
    public IndustryProfileResponseDto updateProfile(
            @AuthenticationPrincipal AuthUser currentUser,
            @RequestBody IndustryProfileRequestDto requestDto
    ) {
        return industryProfileService.updateProfile(currentUser, requestDto);
    }
}
