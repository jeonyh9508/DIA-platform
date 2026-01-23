package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private int reviewId;         // PK
    private Integer userId;       // FK, 탈퇴 시 NULL
    private int programId;        // FK
    private int workshopId;
    private int reservationId;    // FK
    private int rating;            // 평점 1~5
    private String content;        // 후기 내용
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date updatedAt;       // 수정일
    private String reviewImage;   // 후기 이미지 경로

    //user
    private String name; // 사용자 이름
    private String profileImg; // 사용자 프로필

    //program
    private String title; // 프로그램 제목
    private String thumb; // 프로그램 썸네일
    
    private String workshopName; // 공방 이름

}
