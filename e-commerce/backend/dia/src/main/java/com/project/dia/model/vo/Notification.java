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
public class Notification {
    private int notificationId;   // PK
    private Integer senderId;     // FK, 발신자
    private String targetType;    // USER/WORKSHOP
    private Integer workshopId;   // FK
    private String message;        // 메시지 내용
    private String type;           // 알림 타입
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
}
