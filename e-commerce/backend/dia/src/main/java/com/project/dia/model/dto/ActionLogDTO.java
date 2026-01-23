package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ActionLogDTO {
    private int actionLogId;    // PK
    private String targetType;  // WORKSHOP / PROGRAM / QNA / BANNER / USER 등
    private int targetId;       // workshop_id, program_id, qna_id 등
    private int adminId;        // FK (관리자 ID)
    private String adminName;
    private String actionType;  // APPROVE / REJECT / UPDATE / CREATE / DELETE 등
    private String reason;      // 거절 사유, 수정 이유
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;     // 생성일시
    private String targetName;
    private String monthly;
    private Integer workshopId;
    private String workshopName;
    private String keyword;
    private int page = 1;
    private int limit = 10;
    private int offset = 0;

    public void setPage(int page) {
        this.page = page;
        this.calcOffset();
    }

    public void setLimit(int limit) {
        this.limit = limit;
        this.calcOffset();
    }
    private void calcOffset() {
        if (this.page < 1) this.page = 1;
        if (this.limit < 1) this.limit = 10; // 기본값 10
        this.offset = (this.page - 1) * this.limit;
    }
    
}
