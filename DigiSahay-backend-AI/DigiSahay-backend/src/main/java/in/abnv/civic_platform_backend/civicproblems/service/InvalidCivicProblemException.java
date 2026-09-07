package in.abnv.civic_platform_backend.civicproblems.service;

import in.abnv.civic_platform_backend.ai.dto.AiAnalysisResponseDto;
import lombok.Getter;

@Getter
public class InvalidCivicProblemException extends RuntimeException {
    private final AiAnalysisResponseDto analysis;
    public InvalidCivicProblemException(String message, AiAnalysisResponseDto analysis) {
        super(message);
        this.analysis = analysis;
    }
}
