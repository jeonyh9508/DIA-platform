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
public class QnaAdmin {
    private int qnaAdminId;      // PK
    private int userId;           // FK
    private Integer adminId;      // FK, NULL 가능
    private String title;          // 문의 제목
    private String content;        // 문의 내용
    private String answer;         // 답변 내용
    private String status;         // 대기, 답변완료, 종료
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date answeredAt;      // 답변일
    
    // QnA
    private String name;           // 작성자 이름

//  private String qnaType;        // 문의 답변자 공방 or 관리자
    private String role;            // 문의 질문자 공방주 or 일반 고객
}
