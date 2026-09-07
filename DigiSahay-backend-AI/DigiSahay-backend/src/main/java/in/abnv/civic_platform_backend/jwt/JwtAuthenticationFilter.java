package in.abnv.civic_platform_backend.jwt;

import in.abnv.civic_platform_backend.common.AuthUser;
import in.abnv.civic_platform_backend.industry.repository.IndustryRepository;
import in.abnv.civic_platform_backend.university.repository.UniversityRepository;
import in.abnv.civic_platform_backend.users.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final IndustryRepository industryRepository;

    @PostConstruct
    public void init() {
        System.out.println("JWT FILTER HAS BEEN REGISTERED!");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtService.extractEmail(token);

            System.out.println("Email extracted from token: " + email);

            AuthUser authUser = findAuthUserByEmail(email);

            if (authUser != null && jwtService.isTokenValid(token)) {
                List<SimpleGrantedAuthority> authorities = authUser.getRole() != null
                        ? List.of(new SimpleGrantedAuthority("ROLE_" + authUser.getRole().name()))
                        : Collections.emptyList();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                authUser,
                                null,
                                authorities
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

                System.out.println("User authenticated successfully as: " + authUser.getRole());
            } else {
                System.out.println("User not found or token invalid!");
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private AuthUser findAuthUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(u -> (AuthUser) u)
                .or(() -> universityRepository.findByEmail(email).map(u -> (AuthUser) u))
                .or(() -> industryRepository.findByEmail(email).map(u -> (AuthUser) u))
                .orElse(null);
    }
}
