package com.project.dia.dao;

import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.dto.NotificationUserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NotificationDAO {
    List<NotificationUserDTO> wsNotice (int workshopId);
    void wsNoticeRead(int notificationId);
    void insertNoti (NotificationDTO dto);
    void insertNotiUser (NotificationDTO dto);
    void insertNotiWorkshop (NotificationDTO dto);
}
