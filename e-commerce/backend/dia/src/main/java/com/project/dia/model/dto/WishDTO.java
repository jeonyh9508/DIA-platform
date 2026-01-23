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
public class WishDTO {
    private int wishId;           // PK
    private int userId;           // FK
    private int programId;        // FK
    private boolean active;     // 활성 여부
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date updatedAt;       // 수정일

    private String action; // 위시 add / remove

    // Program 정보
    private String category;
    private String thumb;
    private String title;
    private long price;

    // Workshop 정보
    private int workshopId;
    private String workshopName;
    private String address;
    private String profileImg;

    // 통계 정보
    private double averageRating;
    private int countReview;
    private int countWish;

    // 유저 정보
    private String name;
}
