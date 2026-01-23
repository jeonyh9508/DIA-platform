package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfitDTO {
    private int profitId;
    private String role;
    private int ownerId;        // DB 컬럼 owner_id와 매핑
    private String monthly;
    private Long totalAmount;
    private Integer commissionRate; // DB 컬럼 commission_rate와 매핑
    private Long commissionAmt;
    private int workshopId;       // FK
    private Integer programId;    // FK, NULL 가능
    private String paidStatus;    // PAID, PENDING, REFUNDED, CANCELLED
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date settledAt;       // 정산일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date updatedAt;       // 수정일

    // user
    private String ownerName;

    // workshop
    private String workshopName;

    // settlement
    private Long finalAmount;
    private Integer adjustAmount;

    private Long totalPrice;
    private String name;
    private String title;
    private String startMonth;
    private String endMonth;



}
