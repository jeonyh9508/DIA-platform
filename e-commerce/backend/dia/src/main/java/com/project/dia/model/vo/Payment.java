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
public class Payment {
    private int paymentId;        // PK
    private int reservationId;    // FK reservation.reservation_id
    private String method;         // CARD, BANK, KAKAOPAY, NAVERPAY
    private long amount;           // 결제 금액
    private String status;         // PENDING, SUCCESS, FAILED, REFUNDED
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date paidAt;          // 결제 시각
}
