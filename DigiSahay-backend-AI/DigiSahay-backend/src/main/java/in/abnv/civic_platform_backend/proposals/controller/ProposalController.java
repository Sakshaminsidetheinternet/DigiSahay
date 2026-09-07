package in.abnv.civic_platform_backend.proposals.controller;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.proposals.dto.ProposalResponseDto;
import in.abnv.civic_platform_backend.proposals.service.ProposalService;
import in.abnv.civic_platform_backend.users.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService service;

    @PostMapping(value = "/university", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProposalResponseDto> create(
            @RequestParam(required = false) Long universityId,
            @RequestParam Long problemId,
            @RequestParam String solutionTitle,
            @RequestParam(required = false) String mentor,
            @RequestParam(required = false) String studentTeam,
            @RequestParam(required = false) String trlLevel,
            @RequestParam(required = false) String fundingRequired,
            @RequestPart(required = false) MultipartFile pdf,
            Authentication authentication
    ) {
        AuthUser user = (AuthUser) authentication.getPrincipal();
        if (user.getRole() != Role.UNIVERSITIES) {
            throw new RuntimeException("Only university accounts can submit solution proposals.");
        }
        Long verifiedUniversityId = user.getId();

        return ResponseEntity.status(HttpStatus.CREATED).body(
                service.create(
                        verifiedUniversityId,
                        problemId,
                        solutionTitle,
                        mentor,
                        studentTeam,
                        trlLevel,
                        fundingRequired,
                        pdf
                )
        );
    }

    @GetMapping
    public List<ProposalResponseDto> all() {
        return service.all();
    }

    @GetMapping("/university/{universityId}")
    public List<ProposalResponseDto> university(
            @PathVariable Long universityId,
            Authentication authentication
    ) {
        return service.byUniversity(universityId);
    }

    @GetMapping("/problem/{problemId}")
    public List<ProposalResponseDto> problem(@PathVariable Long problemId) {
        return service.byProblem(problemId);
    }
}
