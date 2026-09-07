package in.abnv.civic_platform_backend.users.service;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.common.EmailUniquenessChecker;
import in.abnv.civic_platform_backend.exception.InvalidPasswordException;
import in.abnv.civic_platform_backend.exception.UserNotFoundException;
import in.abnv.civic_platform_backend.industry.entity.Industry;
import in.abnv.civic_platform_backend.industry.repository.IndustryRepository;
import in.abnv.civic_platform_backend.jwt.JwtService;
import in.abnv.civic_platform_backend.university.entity.University;
import in.abnv.civic_platform_backend.university.repository.UniversityRepository;
import in.abnv.civic_platform_backend.users.dto.LoginRequestDto;
import in.abnv.civic_platform_backend.users.dto.LoginResponseDto;
import in.abnv.civic_platform_backend.users.dto.ProfileResponseDto;
import in.abnv.civic_platform_backend.users.dto.RegisterUserRequestDto;
import in.abnv.civic_platform_backend.users.dto.UpdateProfileRequestDto;
import in.abnv.civic_platform_backend.users.entity.Role;
import in.abnv.civic_platform_backend.users.entity.User;
import in.abnv.civic_platform_backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Handles citizens (the "users" table) only. Registration/profile logic for
 * universities and industries lives in their own packages/tables; login still
 * checks all three tables since a single email+password can belong to any of them.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final IndustryRepository industryRepository;
    private final EmailUniquenessChecker emailUniquenessChecker;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthUser registerUser(RegisterUserRequestDto requestDto) {

        if (emailUniquenessChecker.existsAnywhere(requestDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = requestDto.getRole() == null ? Role.CITIZEN : requestDto.getRole();
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        // The final DigiSahay frontend uses ONE /api/users/register endpoint
        // for all three portals. Persist the account in the correct table.
        if (role == Role.UNIVERSITIES) {
            University university = University.builder()
                    .name(requestDto.getName())
                    .email(requestDto.getEmail())
                    .password(encodedPassword)
                    .role(Role.UNIVERSITIES)
                    .build();
            return universityRepository.save(university);
        }

        if (role == Role.INDUSTRY) {
            Industry industry = Industry.builder()
                    .companyName(requestDto.getName())
                    .email(requestDto.getEmail())
                    .password(encodedPassword)
                    .role(Role.INDUSTRY)
                    .build();
            return industryRepository.save(industry);
        }

        User user = User.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
                .password(encodedPassword)
                .build();

        return userRepository.save(user);
    }

    public LoginResponseDto loginUser(LoginRequestDto loginRequestDto) {

        // 1. Check Citizen users table
        Optional<User> userOpt = userRepository.findByEmail(loginRequestDto.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
                throw new InvalidPasswordException("Invalid password");
            }
            return LoginResponseDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .token(jwtService.generateToken(user.getEmail()))
                    .build();
        }

        // 2. Check University table
        Optional<University> uniOpt = universityRepository.findByEmail(loginRequestDto.getEmail());
        if (uniOpt.isPresent()) {
            University uni = uniOpt.get();
            if (!passwordEncoder.matches(loginRequestDto.getPassword(), uni.getPassword())) {
                throw new InvalidPasswordException("Invalid password");
            }
            return LoginResponseDto.builder()
                    .id(uni.getId())
                    .name(uni.getName())
                    .email(uni.getEmail())
                    .role(uni.getRole())
                    .token(jwtService.generateToken(uni.getEmail()))
                    .build();
        }

        // 3. Check Industry table
        Optional<Industry> indOpt = industryRepository.findByEmail(loginRequestDto.getEmail());
        if (indOpt.isPresent()) {
            Industry ind = indOpt.get();
            if (!passwordEncoder.matches(loginRequestDto.getPassword(), ind.getPassword())) {
                throw new InvalidPasswordException("Invalid password");
            }
            return LoginResponseDto.builder()
                    .id(ind.getId())
                    .name(ind.getCompanyName())
                    .email(ind.getEmail())
                    .role(ind.getRole())
                    .token(jwtService.generateToken(ind.getEmail()))
                    .build();
        }

        throw new UserNotFoundException("User not found");
    }

    public ProfileResponseDto getProfile(AuthUser currentUser) {
        requireCitizenRole(currentUser);

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return toProfileResponseDto(user, null);
    }

    public ProfileResponseDto updateProfile(AuthUser currentUser, UpdateProfileRequestDto requestDto) {
        requireCitizenRole(currentUser);

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        boolean emailChanged = !user.getEmail().equalsIgnoreCase(requestDto.getEmail());

        if (emailChanged && emailUniquenessChecker.existsAnywhere(requestDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());
        user.setAge(requestDto.getAge());
        user.setPhone(requestDto.getPhone());
        user.setStreet(requestDto.getStreet());
        user.setCity(requestDto.getCity());
        user.setState(requestDto.getState());
        user.setPinCode(requestDto.getPinCode());

        User savedUser = userRepository.save(user);

        String newToken = emailChanged ? jwtService.generateToken(savedUser.getEmail()) : null;

        return toProfileResponseDto(savedUser, newToken);
    }

    private void requireCitizenRole(AuthUser user) {
        if (user == null || user.getRole() != Role.CITIZEN) {
            throw new RuntimeException("Only citizen accounts can access this profile");
        }
    }

    private ProfileResponseDto toProfileResponseDto(User user, String token) {
        return ProfileResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .age(user.getAge())
                .phone(user.getPhone())
                .street(user.getStreet())
                .city(user.getCity())
                .state(user.getState())
                .pinCode(user.getPinCode())
                .createdAt(user.getCreatedAt())
                .token(token)
                .build();
    }
}
