package in.abnv.civic_platform_backend.civicproblems.repository;

import in.abnv.civic_platform_backend.civicproblems.entity.CivicProblem;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemCategory;
import in.abnv.civic_platform_backend.civicproblems.entity.ProblemStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CivicProblemRepository extends JpaRepository<CivicProblem, Long> {

    List<CivicProblem> findByReportedById(Long userId);
    List<CivicProblem> findByCity(String city);
    List<CivicProblem> findByStatus(ProblemStatus status);
    List<CivicProblem> findByCityIgnoreCase(String city);

    @Query("SELECT p FROM CivicProblem p WHERE LOWER(TRIM(p.city)) = LOWER(TRIM(:city)) AND p.category = :category AND p.status IN (:statuses)")
    List<CivicProblem> findDuplicateCandidates(
            @Param("city") String city,
            @Param("category") ProblemCategory category,
            @Param("statuses") Collection<ProblemStatus> statuses
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM CivicProblem p WHERE p.id = :id")
    Optional<CivicProblem> findByIdForUpdate(@Param("id") Long id);
}
