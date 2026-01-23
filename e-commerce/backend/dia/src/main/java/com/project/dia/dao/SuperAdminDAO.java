package com.project.dia.dao;

import com.project.dia.model.dto.ChartDTO;
import com.project.dia.model.vo.User;
import com.project.dia.model.vo.Workshop;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface SuperAdminDAO {
    int todayVisitors(); // 오늘의 방문자수
    int totalUsers(); // 총 회원수
    int onlineUsers(LocalDateTime timeLimit);
    int currentTraffic(LocalDateTime timeLimit);
    List<ChartDTO> weeklyTraffic();
    List<ChartDTO> hotWorkshops();
    List<User> recentUsers();
    List<Workshop> recentWorkshops();
}
