package in.abnv.civic_platform_backend.university.repository;

import in.abnv.civic_platform_backend.university.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByEmail(String email);
    boolean existsByEmail(String email);
}

