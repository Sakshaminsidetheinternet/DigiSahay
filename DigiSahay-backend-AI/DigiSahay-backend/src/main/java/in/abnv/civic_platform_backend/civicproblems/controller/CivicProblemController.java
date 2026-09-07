package in.abnv.civic_platform_backend.civicproblems.controller;


import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.civicproblems.dto.CivicProblemResponseDto;
import in.abnv.civic_platform_backend.civicproblems.dto.CreateCivicProblemRequestDto;
import in.abnv.civic_platform_backend.civicproblems.service.CivicProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import in.abnv.civic_platform_backend.users.entity.Role;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class CivicProblemController {
    private final CivicProblemService civicProblemService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<CivicProblemResponseDto> createProblem(
            @Valid @ModelAttribute CreateCivicProblemRequestDto requestDto,
            @RequestParam(required = false) MultipartFile image,
            Authentication authentication
    ) {
        AuthUser user = (AuthUser) authentication.getPrincipal();

        CivicProblemResponseDto res = civicProblemService.createProblem(
                requestDto,
                image,
                user.getEmail()
        );

        if (Boolean.TRUE.equals(res.getDuplicate())) {
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
    @GetMapping
    public List<CivicProblemResponseDto> getAllProblems() {

        return civicProblemService.getAllProblems();
    }
    @GetMapping("/recommended")
    public List<CivicProblemResponseDto> getRecommendedProblems(Authentication authentication) {
        AuthUser user = (AuthUser) authentication.getPrincipal();
        if (user.getRole() != Role.UNIVERSITIES) {
            throw new RuntimeException("Only university accounts can access recommended problems");
        }
        return civicProblemService.getRecommendedProblems(user.getId());
    }

    @GetMapping("/{id}")
    public CivicProblemResponseDto getProblemById(
            @PathVariable Long id
    ) {
        return civicProblemService.getProblemById(id);
    }
    @GetMapping("/my-problems")
    public List<CivicProblemResponseDto> getMyProblems(
            Authentication authentication
    ) {

        AuthUser user = (AuthUser) authentication.getPrincipal();

        return civicProblemService.getMyProblems(
                user.getEmail()
        );
    }
}
