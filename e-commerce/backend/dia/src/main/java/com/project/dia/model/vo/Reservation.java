package com.project.dia.model.vo;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class Reservation {
    private int reservationId;    // PK
    private int scheduleId;       // FK
    private Integer userId;       // FK (Null 허용 Integer로)
    private int numPeople;        // 예약 인원
    private long totalPrice;      // 총 금액
    private String status;         // PAID, CANCELLED, COMPLETED
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date reservedAt;      // 예약 시각
    private boolean profitPaid;
}
