package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.dia.model.vo.User;
import com.project.dia.model.vo.Workshop;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuperDashboardDTO {
    private int todayVisitors;     // 오늘 방문자
    private int totalUsers;        // 총 회원
    private int onlineUsers;       // 실시간 접속자
    private int currentTraffic;      // 실시간 트래픽

    private List<ChartDTO> weeklyTraffic; // 주간 방문자
    private List<ChartDTO> hotWorkshops; // 인기 공방 top5

    private List<User> recentUsers; // 최근 가입 회원
    private List<Workshop> recentWorkshops; // 최근 생성 공방
}
