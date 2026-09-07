package in.abnv.civic_platform_backend.university.service;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.common.EmailUniquenessChecker;
import in.abnv.civic_platform_backend.university.dto.RegisterUniversityRequestDto;
import in.abnv.civic_platform_backend.university.dto.UniversityProfileRequestDto;
import in.abnv.civic_platform_backend.university.dto.UniversityProfileResponseDto;
import in.abnv.civic_platform_backend.university.entity.University;
import in.abnv.civic_platform_backend.university.repository.UniversityRepository;
import in.abnv.civic_platform_backend.users.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UniversityProfileService {

    private final UniversityRepository universityRepository;
    private final EmailUniquenessChecker emailUniquenessChecker;
    private final PasswordEncoder passwordEncoder;

    public University registerUniversity(RegisterUniversityRequestDto requestDto) {
        if (emailUniquenessChecker.existsAnywhere(requestDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        University university = University.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .role(Role.UNIVERSITIES)
                .build();

        return universityRepository.save(university);
    }

    public UniversityProfileResponseDto getProfile(AuthUser currentUser) {
        requireUniversityRole(currentUser);

        University university = universityRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("University not found"));

        return toDto(university);
    }

    public UniversityProfileResponseDto updateProfile(AuthUser currentUser, UniversityProfileRequestDto requestDto) {
        requireUniversityRole(currentUser);

        University university = universityRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("University not found"));

        university.setShortName(requestDto.getShortName());
        university.setDean(requestDto.getDean());
        university.setNaacGrade(requestDto.getNaacGrade());
        university.setNirfRank(requestDto.getNirfRank());
        university.setEstablished(requestDto.getEstablished());
        university.setStreet(requestDto.getStreet());
        university.setSector(requestDto.getSector());
        university.setCity(requestDto.getCity());
        university.setState(requestDto.getState());
        university.setPinCode(requestDto.getPinCode());
        university.setExpertise(requestDto.getExpertise());

        University saved = universityRepository.save(university);

        return toDto(saved);
    }

    private void requireUniversityRole(AuthUser user) {
        if (user == null || user.getRole() != Role.UNIVERSITIES) {
            throw new RuntimeException("Only university accounts can access this profile");
        }
    }

    private UniversityProfileResponseDto toDto(University university) {
        return UniversityProfileResponseDto.builder()
                .id(university.getId())
                .name(university.getName())
                .email(university.getEmail())
                .shortName(university.getShortName())
                .dean(university.getDean())
                .naacGrade(university.getNaacGrade())
                .nirfRank(university.getNirfRank())
                .established(university.getEstablished())
                .street(university.getStreet())
                .sector(university.getSector())
                .city(university.getCity())
                .state(university.getState())
                .pinCode(university.getPinCode())
                .expertise(university.getExpertise())
                .createdAt(university.getCreatedAt())
                .build();
    }
}
