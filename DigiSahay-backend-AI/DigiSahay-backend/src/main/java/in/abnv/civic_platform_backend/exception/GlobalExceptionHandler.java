package in.abnv.civic_platform_backend.exception;

import in.abnv.civic_platform_backend.civicproblems.service.InvalidCivicProblemException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCivicProblemException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCivicProblem(InvalidCivicProblemException ex) {
        var a = ex.getAnalysis();
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("isValid", a != null && Boolean.TRUE.equals(a.getIsValid()));
        body.put("isVague", a != null && Boolean.TRUE.equals(a.getIsVague()));
        body.put("isPersonal", a != null && Boolean.TRUE.equals(a.getIsPersonal()));
        body.put("isPublic", a != null && Boolean.TRUE.equals(a.getIsPublic()));
        body.put("reason", (a != null && a.getReason() != null) ? a.getReason() : ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPasswordException(InvalidPasswordException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage();
        if (msg == null || msg.isBlank()) {
            msg = "An error occurred while processing your request.";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", msg));
    }
}
