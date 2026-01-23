package com.project.dia.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationUser {
    private int id;                // PK
    private int notificationId;   // FK (알림)
    private int userId;           // FK (수신자)
    private boolean viewed;       // 읽음 여부
}
