package in.abnv.civic_platform_backend;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.industry.dto.IndustryProfileRequestDto;
import in.abnv.civic_platform_backend.industry.dto.IndustryProfileResponseDto;
import in.abnv.civic_platform_backend.industry.dto.RegisterIndustryRequestDto;
import in.abnv.civic_platform_backend.industry.entity.Industry;
import in.abnv.civic_platform_backend.industry.repository.IndustryRepository;
import in.abnv.civic_platform_backend.industry.service.IndustryProfileService;
import in.abnv.civic_platform_backend.university.dto.RegisterUniversityRequestDto;
import in.abnv.civic_platform_backend.university.dto.UniversityProfileRequestDto;
import in.abnv.civic_platform_backend.university.dto.UniversityProfileResponseDto;
import in.abnv.civic_platform_backend.university.entity.University;
import in.abnv.civic_platform_backend.university.repository.UniversityRepository;
import in.abnv.civic_platform_backend.university.service.UniversityProfileService;
import in.abnv.civic_platform_backend.users.dto.LoginRequestDto;
import in.abnv.civic_platform_backend.users.dto.LoginResponseDto;
import in.abnv.civic_platform_backend.users.dto.ProfileResponseDto;
import in.abnv.civic_platform_backend.users.dto.RegisterUserRequestDto;
import in.abnv.civic_platform_backend.users.dto.UpdateProfileRequestDto;
import in.abnv.civic_platform_backend.users.entity.Role;
import in.abnv.civic_platform_backend.users.entity.User;
import in.abnv.civic_platform_backend.users.repository.UserRepository;
import in.abnv.civic_platform_backend.users.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ProfileSegregationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private IndustryRepository industryRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UniversityProfileService universityProfileService;

    @Autowired
    private IndustryProfileService industryProfileService;

    @Test
    void testCitizenRegistrationAndProfileInUsersTable() {
        RegisterUserRequestDto regDto = new RegisterUserRequestDto();
        regDto.setName("Anvita Citizen");
        regDto.setEmail("anvita.test@example.com");
        regDto.setPassword("pass123");

        AuthUser registered = userService.registerUser(regDto);
        assertNotNull(registered.getId());
        assertEquals(Role.CITIZEN, registered.getRole());

        // Must exist in users table
        assertTrue(userRepository.findById(registered.getId()).isPresent());
        // Must NOT exist in universities or industries
        assertFalse(universityRepository.findByEmail("anvita.test@example.com").isPresent());
        assertFalse(industryRepository.findByEmail("anvita.test@example.com").isPresent());

        // Update profile
        UpdateProfileRequestDto updateReq = new UpdateProfileRequestDto();
        updateReq.setName("Anvita Updated");
        updateReq.setEmail("anvita.test@example.com");
        updateReq.setAge(22);
        updateReq.setCity("Ghaziabad");
        updateReq.setPhone("9999999999");
        updateReq.setState("Uttar Pradesh");
        updateReq.setPinCode("201010");

        ProfileResponseDto profile = userService.updateProfile(registered, updateReq);
        assertEquals(22, profile.getAge());
        assertEquals("Ghaziabad", profile.getCity());

        // Login works
        LoginResponseDto login = userService.loginUser(new LoginRequestDto("anvita.test@example.com", "pass123"));
        assertNotNull(login.getToken());
        assertEquals(Role.CITIZEN, login.getRole());
    }

    @Test
    void testUniversityRegistrationInUniversitiesTableOnly() {
        RegisterUniversityRequestDto regDto = new RegisterUniversityRequestDto();
        regDto.setName("Ajay Kumar Garg Engg College");
        regDto.setEmail("akgec.test@example.com");
        regDto.setPassword("pass123");

        University registered = universityProfileService.registerUniversity(regDto);
        assertNotNull(registered.getId());
        assertEquals(Role.UNIVERSITIES, registered.getRole());

        // Must exist in universities table
        assertTrue(universityRepository.findById(registered.getId()).isPresent());
        // Must NOT exist in users table!
        assertFalse(userRepository.findByEmail("akgec.test@example.com").isPresent());
        assertFalse(industryRepository.findByEmail("akgec.test@example.com").isPresent());

        // Update university profile
        UniversityProfileRequestDto updateReq = new UniversityProfileRequestDto();
        updateReq.setDean("Dr. Director");
        updateReq.setNaacGrade("A++");
        updateReq.setNirfRank("15");
        updateReq.setCity("Ghaziabad");
        updateReq.setState("Uttar Pradesh");

        UniversityProfileResponseDto profile = universityProfileService.updateProfile(registered, updateReq);
        assertEquals("Dr. Director", profile.getDean());
        assertEquals("A++", profile.getNaacGrade());

        // Login works
        LoginResponseDto login = userService.loginUser(new LoginRequestDto("akgec.test@example.com", "pass123"));
        assertNotNull(login.getToken());
        assertEquals(Role.UNIVERSITIES, login.getRole());
    }

    @Test
    void testIndustryRegistrationInIndustriesTableOnly() {
        RegisterIndustryRequestDto regDto = new RegisterIndustryRequestDto();
        regDto.setCompanyName("Tata Consulting Services");
        regDto.setEmail("tcs.test@example.com");
        regDto.setPassword("pass123");

        Industry registered = industryProfileService.registerIndustry(regDto);
        assertNotNull(registered.getId());
        assertEquals(Role.INDUSTRY, registered.getRole());

        // Must exist in industries table
        assertTrue(industryRepository.findById(registered.getId()).isPresent());
        // Must NOT exist in users table!
        assertFalse(userRepository.findByEmail("tcs.test@example.com").isPresent());
        assertFalse(universityRepository.findByEmail("tcs.test@example.com").isPresent());

        // Update industry profile
        IndustryProfileRequestDto updateReq = new IndustryProfileRequestDto();
        updateReq.setCompanyName("Tata Consulting Services Ltd");
        updateReq.setCin("L72200MH1995PLC095651");
        updateReq.setSector("Information Technology");
        updateReq.setNodalOfficer("Rajesh");
        updateReq.setCity("Mumbai");

        IndustryProfileResponseDto profile = industryProfileService.updateProfile(registered, updateReq);
        assertEquals("Tata Consulting Services Ltd", profile.getCompanyName());
        assertEquals("L72200MH1995PLC095651", profile.getCin());

        // Login works
        LoginResponseDto login = userService.loginUser(new LoginRequestDto("tcs.test@example.com", "pass123"));
        assertNotNull(login.getToken());
        assertEquals(Role.INDUSTRY, login.getRole());
    }
}
