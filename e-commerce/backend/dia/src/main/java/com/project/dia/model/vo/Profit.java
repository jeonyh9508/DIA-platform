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
public class Profit {
    private int profitId;         // PK
    private int workshopId;       // FK
    private Integer programId;    // FK, NULL 가능
    private long totalAmount;     // 총 수익
    private double commissionRate;// 수수료율(%)
    private long commissionAmt;   // Service에서 계산
    private String paidStatus;    // PAID, PENDING, REFUNDED, CANCELLED
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date settledAt;       // 정산일
    private String monthly;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date updatedAt;       // 수정일
}
