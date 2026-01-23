package com.project.dia.controller;

import com.project.dia.config.security.PrincipalDetails;
import com.project.dia.model.vo.User;
import com.project.dia.service.EmailAuthService;
import com.project.dia.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // React dev 서버 허용
public class UserController {
    private final UserService userService;
    private final EmailAuthService emailAuthService;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User vo) {
        try {
            userService.registerUser(vo);
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        }
    }

    @GetMapping("/api/auth/current-user")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        if (principalDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        User user = principalDetails.getUser();

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("userId", user.getUserId());
        userInfo.put("email", user.getEmail());
        userInfo.put("name", user.getName());
        userInfo.put("role", user.getRole());
        userInfo.put("phone", user.getPhone());
        userInfo.put("createdAt", user.getCreatedAt().getTime());
        userInfo.put("profileImg", user.getProfileImg());
        userInfo.put("authorities", principalDetails.getAuthorities());

        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/api/auth/protected-resource")
    public ResponseEntity<String> getProtectedResource() {
        return ResponseEntity.ok("이것은 인증된 사용자만 볼 수 있는 비밀 정보입니다!");
    }

    // 이메일 인증
    @PostMapping("/api/auth/email-verify")

    public String emailCheck(@RequestBody User vo){
        String res = emailAuthService.joinEmail(vo.getEmail());
        return res;
    }

    // 비밀번호 변경
    @PostMapping("/api/auth/change-password")
    public int changePassword(@RequestBody User vo) {
        int res = userService.changePwd(vo);
        return res;
    }

    // 이메일 중복 확인
//    @PostMapping("/api/auth/email-check")

}
