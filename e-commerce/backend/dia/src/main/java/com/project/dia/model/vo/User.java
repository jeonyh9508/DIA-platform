package com.project.dia.model.vo;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails, Serializable {
    private static final long serialVersionUID = 1L;

    private int userId;           // PK
    private String email;          // 로그인 이메일
    private String password;       // 암호화된 비밀번호
    private String name;           // 사용자 이름
    private String role;           // ADMIN, SELLER, CUSTOMER
    private String phone;          // 연락처
    private boolean active;        // 계정 활성 여부
    private String profileImg;    // 프로필 이미지
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isEnabled() {
        return this.active == true;
    }
}