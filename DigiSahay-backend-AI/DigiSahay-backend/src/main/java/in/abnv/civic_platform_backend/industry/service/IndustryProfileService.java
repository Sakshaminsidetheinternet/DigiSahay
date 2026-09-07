package in.abnv.civic_platform_backend.industry.service;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.common.EmailUniquenessChecker;
import in.abnv.civic_platform_backend.industry.dto.IndustryProfileRequestDto;
import in.abnv.civic_platform_backend.industry.dto.IndustryProfileResponseDto;
import in.abnv.civic_platform_backend.industry.dto.RegisterIndustryRequestDto;
import in.abnv.civic_platform_backend.industry.entity.Industry;
import in.abnv.civic_platform_backend.industry.repository.IndustryRepository;
import in.abnv.civic_platform_backend.users.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IndustryProfileService {

    private final IndustryRepository industryRepository;
    private final EmailUniquenessChecker emailUniquenessChecker;
    private final PasswordEncoder passwordEncoder;

    public Industry registerIndustry(RegisterIndustryRequestDto requestDto) {
        if (emailUniquenessChecker.existsAnywhere(requestDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Industry industry = Industry.builder()
                .companyName(requestDto.getCompanyName())
                .email(requestDto.getEmail())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .role(Role.INDUSTRY)
                .build();

        return industryRepository.save(industry);
    }

    public IndustryProfileResponseDto getProfile(AuthUser currentUser) {
        requireIndustryRole(currentUser);

        Industry industry = industryRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Industry not found"));

        return toDto(industry);
    }

    public IndustryProfileResponseDto updateProfile(AuthUser currentUser, IndustryProfileRequestDto requestDto) {
        requireIndustryRole(currentUser);

        Industry industry = industryRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Industry not found"));

        industry.setCompanyName(requestDto.getCompanyName());
        industry.setShortName(requestDto.getShortName());
        industry.setSector(requestDto.getSector());
        industry.setNodalOfficer(requestDto.getNodalOfficer());
        industry.setDesignation(requestDto.getDesignation());
        industry.setCin(requestDto.getCin());
        industry.setEstablished(requestDto.getEstablished());
        industry.setStreet(requestDto.getStreet());
        industry.setSectorArea(requestDto.getSectorArea());
        industry.setCity(requestDto.getCity());
        industry.setState(requestDto.getState());
        industry.setPinCode(requestDto.getPinCode());

        Industry saved = industryRepository.save(industry);

        return toDto(saved);
    }

    private void requireIndustryRole(AuthUser user) {
        if (user == null || user.getRole() != Role.INDUSTRY) {
            throw new RuntimeException("Only industry accounts can access this profile");
        }
    }

    private IndustryProfileResponseDto toDto(Industry industry) {
        return IndustryProfileResponseDto.builder()
                .id(industry.getId())
                .name(industry.getCompanyName())
                .email(industry.getEmail())
                .companyName(industry.getCompanyName())
                .shortName(industry.getShortName())
                .sector(industry.getSector())
                .nodalOfficer(industry.getNodalOfficer())
                .designation(industry.getDesignation())
                .cin(industry.getCin())
                .established(industry.getEstablished())
                .street(industry.getStreet())
                .sectorArea(industry.getSectorArea())
                .city(industry.getCity())
                .state(industry.getState())
                .pinCode(industry.getPinCode())
                .createdAt(industry.getCreatedAt())
                .build();
    }
}
