package com.project.dia.model.vo;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workshop {
    private int workshopId;       // PK
    private int ownerId;          // FK user.user_id
    private String name;           // 공방 이름
    private String description;    // 공방 소개
    private String profileImg;    // 공방 프로필
    private String address;        // 공방 주소
    private String contactNumber; // 연락처
    private String status;         // OPEN, CLOSED, HIDDEN
    private String approved;       // PENDING, APPROVED, REJECTED
    private boolean active;        // 소프트 삭제 방식
    private double averageRating; // 평균 평점
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
}
