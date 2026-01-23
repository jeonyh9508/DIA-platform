package com.project.dia.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Banner {
    private int bannerId;     // PK
    private int adminId;      // FK user_id, 배너 등록/삭제 관리자
    private String title;     // 배너 사진 이름
    private String image;     // 이미지
    private String link;      // 링크
    private int sortOrder;    // 순서
    private boolean active;   // 활성화/비활성화
    private Date createdAt;   // 등록일
}
