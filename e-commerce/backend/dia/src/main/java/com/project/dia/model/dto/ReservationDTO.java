package com.project.dia.model.dto;

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
public class ReservationDTO {
    private int reservationId;    // PK
    private int scheduleId;       // FK
    private Integer userId;       // FK (Null 허용 Integer로)
    private int numPeople;        // 예약 인원
    private long totalPrice;      // 총 금액
    private String status;         // PAID, CANCELLED, COMPLETED
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date reservedAt;      // 예약 시각
    private boolean profitPaid;

    private String scheduleDate;   // 프로그램 일시 DATE_FORMAT
    private String scheduleDay;
    private String scheduleTime;

    //schedule
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date startTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")// 시작 시간
    private Date endTime;         // 종료 시간

    //program
    private int programId;
    private String title;          // 프로그램 제목
    private String thumb;          // 썸네일 이미지 경로
    private long price;

    //user
    private String name;
    private String email;
    private String phone;

    //workshop
    private int workshopId;
    private String address;

    //payment
    private int paymentId;
    private String method;
    private String paymentStatus;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date paidAt;

}
