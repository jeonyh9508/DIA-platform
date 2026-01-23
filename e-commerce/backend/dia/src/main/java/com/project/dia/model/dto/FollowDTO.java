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
public class FollowDTO {
    private int followId;         // PK
    private int userId;           // FK
    private int workshopId;       // FK
    private boolean active;     // 활성 여부
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date updatedAt;       // 수정일

    private int totalFollow;
    private String name;           // 공방 이름
    private String profileImg;    // 공방 프로필 사진
}
