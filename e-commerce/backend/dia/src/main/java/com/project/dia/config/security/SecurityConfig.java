package com.project.dia.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.dia.model.vo.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; 
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public AuthenticationSuccessHandler customAuthenticationSuccessHandler(
            ObjectMapper objectMapper,
            SecurityContextRepository securityContextRepository
    ) {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                Authentication authentication) throws IOException, ServletException {
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
                securityContextRepository.saveContext(context, request, response);

                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json;charset=UTF-8");

                PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
                User user = principalDetails.getUser();

                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", user.getUserId());
                userInfo.put("message", "로그인 성공!");
                userInfo.put("name", user.getName());
                userInfo.put("role", user.getRole());
                userInfo.put("authorities", principalDetails.getAuthorities()); 
                userInfo.put("phone", user.getPhone());
                userInfo.put("profileImg", user.getProfileImg());
                userInfo.put("createdAt", user.getCreatedAt());
                userInfo.put("email", user.getEmail());

                response.getWriter().write(objectMapper.writeValueAsString(userInfo));
            }
        };
    }

    @Bean
    public AuthenticationFailureHandler customAuthenticationFailureHandler() {
        return new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest request,
                                                HttpServletResponse response,
                                                AuthenticationException exception) throws IOException, ServletException {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");

                String errorMessage;

                if (exception instanceof DisabledException) {
                    errorMessage = "탈퇴된 계정입니다. 관리자에게 문의하세요.";
                } else if (exception instanceof BadCredentialsException) {
                    errorMessage = "이메일 또는 비밀번호가 일치하지 않습니다.";
                } else if (exception instanceof InternalAuthenticationServiceException) {
                    errorMessage = "내부 시스템 문제로 로그인 요청을 처리할 수 없습니다.";
                } else {
                    errorMessage = exception.getMessage();
                }

                response.getWriter().write("{\"message\": " + errorMessage + "\"}");
            }
        };
    }

    @Bean
    @SuppressWarnings("unchecked")
    public UsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter(
            AuthenticationManager authenticationManager,
            ObjectMapper objectMapper,
            AuthenticationSuccessHandler customAuthenticationSuccessHandler,
            AuthenticationFailureHandler customAuthenticationFailureHandler,
            SecurityContextRepository securityContextRepository
    ) {
        UsernamePasswordAuthenticationFilter filter = new UsernamePasswordAuthenticationFilter() {
            @Override
            public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

                if (!request.getMethod().equals("POST")) {
                    throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
                }

                if (request.getContentType() == null || !request.getContentType().contains("application/json")) {
                    return super.attemptAuthentication(request, response);
                }

                try {
                    Map<String, String> authRequest = objectMapper.readValue(request.getInputStream(), Map.class);
                    String username = authRequest.get(getUsernameParameter());
                    String password = authRequest.get(getPasswordParameter());

                    UsernamePasswordAuthenticationToken authResult = new UsernamePasswordAuthenticationToken(username, password);
                    setDetails(request, authResult);
                    return this.getAuthenticationManager().authenticate(authResult);

                } catch (IOException e) {
                    throw new InternalAuthenticationServiceException("Failed to parse authentication request body", e);
                }
            }
        };

        filter.setAuthenticationManager(authenticationManager);
        filter.setAuthenticationSuccessHandler(customAuthenticationSuccessHandler);
        filter.setAuthenticationFailureHandler(customAuthenticationFailureHandler);
        filter.setUsernameParameter("email");
        filter.setPasswordParameter("password");
        filter.setFilterProcessesUrl("/login");
        filter.setSecurityContextRepository(securityContextRepository);

        return filter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            UsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter,
            SecurityContextRepository securityContextRepository
    ) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) 
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .securityContext(context -> context
                        .securityContextRepository(securityContextRepository)
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/register", "/login", "/api/auth/**", "/**").permitAll()
                        .requestMatchers("/", "/customer", "/customer/search", "/customer/workshop-info", "/customer/program-info").permitAll()

                       
                        .requestMatchers("/customer/mypage", "/customer/my-**", "/customer/reservation/**").hasRole("CUSTOMER")

                    
                        .requestMatchers("/workshop/**").hasRole("WORKSHOP")
                        .anyRequest().authenticated()
                )
                .addFilterAt(jsonUsernamePasswordAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);


    
        http.logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"message\": \"로그아웃 성공!\"}");
                    response.getWriter().flush();
                })
                .deleteCookies("JSESSIONID")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
        );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}