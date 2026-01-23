package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private int userId;           // PK
    private String email;          // 로그인 이메일
    private String password;       // 암호화된 비밀번호
    private String name;           // 사용자 이름
    private String role;           // ADMIN, SELLER, CUSTOMER
    private String phone;          // 연락처
    private boolean active;        // 계정 활성 여부
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
}
