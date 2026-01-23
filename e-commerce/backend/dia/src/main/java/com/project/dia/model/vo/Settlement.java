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
public class Settlement {

    private int settlementId;
    private Integer workshopId;
    private String monthly;
    private Integer originCommission;
    private Integer adjustAmount;
    private Long finalAmount;
    private String status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date billDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date paidDate;
    private int adminCheckerId;
    private boolean adjustCheck;
}