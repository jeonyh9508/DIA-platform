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
public class Program {

    private int programId;        // PK
    private Integer workshopId;       // FK workshop.workshop_id
    private String title;          // 프로그램 제목
    private String description;    // 프로그램 설명
    private String category;       // 카테고리
    private long price;            // 가격
    private int durationMin;      // 소요 시간
    private String difficulty;     // BEGINNER, INTERMEDIATE, ADVANCED
    private String thumb;          // 썸네일 이미지 경로
    private String folder;         // 자료 폴더 경로
    private String status;         // OPEN, CLOSED, CANCELLED
    private String approved;       // PENDING, APPROVED, REJECTED
    private String scheduleType;  // ALWAYS, PERIOD
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date periodStart;     // 기간 시작
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date periodEnd;       // 기간 종료
    private boolean active;        // 소프트 삭제
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
}
