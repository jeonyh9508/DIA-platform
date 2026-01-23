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
public class VisitLog {
    private Long visitId;
    private Integer userId;      // 로그인 안 했으면 null
    private Integer workshopId;  // 메인 페이지면 null, 공방 상세면 ID 값
    private Integer programId;  // 메인 페이지면 null, 프로그램 상세면 ID 값
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date visitedAt;
}
