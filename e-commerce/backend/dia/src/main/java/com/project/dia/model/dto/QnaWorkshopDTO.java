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
public class QnaWorkshopDTO {
    private int qnaId;   // PK
    private Integer userId;       // FK, 탈퇴 시 NULL
    private int programId;        // FK
    private int answererId;       // FK (답변한 사람: workshop_id)
    private String title;          // 문의 제목
    private String content;        // 문의 내용
    private String answer;         // 답변 내용
    private String status;         // WAITING, ANSWERED
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date updatedAt;       // 수정일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date answeredAt;       // 답변일

    private String userName; // 사용자 이름
    private String userProfileImg; // 사용자 프로필

    private int workshopId;
    private String workshopName; // 공방 이름

    private String qnaType; // 답변자 유형(공방, 관리자)

    //qna_admin
    private int qnaAdminId; // id

    //program
    private String programTitle; // 프로그램 제목

    private String name; // 사용자 이름
}
