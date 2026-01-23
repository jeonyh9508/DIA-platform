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
public class NotificationUserDTO {
    private int id;                // PK
    private int notificationId;   // FK (알림)
    private int userId;           // FK (수신자)
    private boolean viewed;       // 읽음 여부
    
    //notification
    private int senderId; // 발신자
    private String message; // 메세지 내용
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt; // 발신일
    private String type;
    //user
    private String name; // 발신자 이름
    
    //workshop
    private Integer workshopId;
    private String workshopName; // 공방 이름
}
