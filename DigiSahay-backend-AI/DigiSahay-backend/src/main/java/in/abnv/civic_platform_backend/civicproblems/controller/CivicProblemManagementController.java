package in.abnv.civic_platform_backend.civicproblems.controller;

import in.abnv.civic_platform_backend.civicproblems.dto.CivicProblemResponseDto;
import in.abnv.civic_platform_backend.civicproblems.entity.CivicProblem;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemStatus;
import in.abnv.civic_platform_backend.civicproblems.repository.CivicProblemRepository;
import in.abnv.civic_platform_backend.civicproblems.service.CivicProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class CivicProblemManagementController {
    private final CivicProblemRepository repository;
    private final CivicProblemService service;

    @PatchMapping("/{id}/status")
    public ResponseEntity<CivicProblemResponseDto> updateStatus(@PathVariable Long id, @RequestParam ProblemStatus status) {
        CivicProblem p = repository.findById(id).orElseThrow(() -> new RuntimeException("Problem not found"));
        p.setStatus(status);
        return ResponseEntity.ok(service.toResponse(repository.save(p)));
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<CivicProblemResponseDto> upvote(@PathVariable Long id) {
        CivicProblem p = repository.findById(id).orElseThrow(() -> new RuntimeException("Problem not found"));
        p.setUpvotes((p.getUpvotes() == null ? 0 : p.getUpvotes()) + 1);
        return ResponseEntity.ok(service.toResponse(repository.save(p)));
    }

    @GetMapping("/heatmap")
    public List<CivicProblemResponseDto> heatmap() {
        return repository.findAll().stream().map(service::toResponse).toList();
    }
}
