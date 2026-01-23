package com.project.dia.service;

import com.project.dia.dao.SuperAdminDAO;
import com.project.dia.model.dto.SuperDashboardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SuperAdminService {
    @Autowired
    SuperAdminDAO superAdminDAO;

    public SuperDashboardDTO getDashboardData() {
        SuperDashboardDTO dto = new SuperDashboardDTO();

        dto.setTodayVisitors( superAdminDAO.todayVisitors() );
        dto.setTotalUsers( superAdminDAO.totalUsers() );

        LocalDateTime timeLimit = LocalDateTime.now().minusMinutes(30);
        dto.setOnlineUsers( superAdminDAO.onlineUsers(timeLimit) );
        dto.setCurrentTraffic( superAdminDAO.currentTraffic(timeLimit) );

        dto.setWeeklyTraffic( superAdminDAO.weeklyTraffic() );
        dto.setHotWorkshops( superAdminDAO.hotWorkshops() );

        dto.setRecentUsers( superAdminDAO.recentUsers() );
        dto.setRecentWorkshops( superAdminDAO.recentWorkshops() );

        return dto;
    }
}
