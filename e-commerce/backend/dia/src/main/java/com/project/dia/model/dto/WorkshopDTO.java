package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.dia.model.vo.Program;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkshopDTO {
    private Integer workshopId;       // PK
    private int ownerId;          // FK user.user_id
    private String name;           // 공방 이름
    private String description;    // 공방 소개
    private String address;        // 공방 주소
    private String contactNumber; // 연락처
    private String status;         // 정상, 휴업, 숨김
    private String approved;       // 대기, 승인, 거절
    private double averageRating; // 평균 평점
    private boolean active;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    private Integer programId;
    private String profileImg;     // 공방 이미지
    private List<Program> program;
    private int totalFollows;  // 공방 팔로워 수
    private int userId;
    private String userName;
    private String email;

    //rejectReason
    private String reason;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date logCreatedAt;
}
