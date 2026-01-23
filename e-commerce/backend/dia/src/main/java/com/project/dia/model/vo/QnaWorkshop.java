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
public class QnaWorkshop {
    private int qnaId;    // PK
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

    private String qnaType;        // 문의 답변자 공방 or 관리자
}
