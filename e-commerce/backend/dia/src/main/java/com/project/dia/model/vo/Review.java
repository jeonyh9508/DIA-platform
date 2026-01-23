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
public class Review {
    private int reviewId;         // PK
    private Integer userId;       // FK, 탈퇴 시 NULL
    private int programId;        // FK
    private int reservationId;    // FK
    private int rating;            // 평점 1~5
    private String content;        // 후기 내용
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date updatedAt;       // 수정일
    private String reviewImage;   // 후기 이미지 경로
}
