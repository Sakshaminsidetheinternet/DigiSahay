package in.abnv.civic_platform_backend.common;

import in.abnv.civic_platform_backend.industry.repository.IndustryRepository;
import in.abnv.civic_platform_backend.university.repository.UniversityRepository;
import in.abnv.civic_platform_backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * The only piece of registration that legitimately spans all three tables:
 * an email must be unique across citizens, universities and industries combined.
 * Each domain's registration service stays otherwise fully independent.
 */
@Component
@RequiredArgsConstructor
public class EmailUniquenessChecker {

    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final IndustryRepository industryRepository;

    public boolean existsAnywhere(String email) {
        return userRepository.existsByEmail(email)
                || universityRepository.existsByEmail(email)
                || industryRepository.existsByEmail(email);
    }
}
