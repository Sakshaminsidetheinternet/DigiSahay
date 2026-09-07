package in.abnv.civic_platform_backend.proposals.repository;
import in.abnv.civic_platform_backend.proposals.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProposalRepository extends JpaRepository<Proposal,Long>{
 List<Proposal> findByUniversityId(Long universityId);
 List<Proposal> findByProblemId(Long problemId);
 long countByProblemId(Long problemId);
}
