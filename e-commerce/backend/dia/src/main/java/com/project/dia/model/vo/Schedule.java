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
public class Schedule {
    private int scheduleId;       // PK
    private int programId;        // FK program.program_id
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date startTime;       // 시작 시간
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date endTime;         // 종료 시간
    private int capacity;          // 일정 정원
    private int currentAttendees; // 현재 참가 인원
    private String status;         // OPEN, CLOSED, CANCELLED
    private boolean active;        // 소프트 삭제 방식
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
}
