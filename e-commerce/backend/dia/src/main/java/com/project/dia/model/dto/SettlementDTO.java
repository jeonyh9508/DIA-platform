package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.util.Date;

@Data
public class SettlementDTO {

    private int settlementId;
    private String monthly;
    private Integer originCommission;
    private Integer adjustAmount;
    private Long finalAmount;
    private String status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date billDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date paidDate;
    private Integer adminCheckerId;
    private boolean adjustCheck;

    private Integer workshopId;
    private String workshopName;

    private Integer userId;

    private Integer ownerId;
    private String ownerName;

    private String adminName;

    // chart
    private Long approvedAmount;
    private Long refundAmount;
    private Long totalApprovedAmount;
    private Long totalRefundAmount;

}