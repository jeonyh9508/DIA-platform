package com.project.dia.model.vo;

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
public class ActionLog {
    private int actionLogId;    // PK
    private String targetType;  // WORKSHOP / PROGRAM / QNA / BANNER / USER 등
    private int targetId;       // workshop_id, program_id, qna_id 등
    private int adminId;        // FK (관리자 ID)
    private String actionType;  // APPROVE / REJECT / UPDATE / CREATE / DELETE 등
    private String reason;      // 거절 사유, 수정 이유
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;     // 생성일시
}
