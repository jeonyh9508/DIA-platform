package com.project.dia.service;

import com.project.dia.dao.NotificationDAO;

import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.dto.NotificationUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationDAO notificationDAO;


    public List<NotificationUserDTO> wsNotice(int workshopId) {
        return notificationDAO.wsNotice(workshopId);
    }


    public void wsNoticeRead(int notificationId) {
        notificationDAO.wsNoticeRead(notificationId);
    }

    @Transactional
    public void sendNotification(NotificationDTO dto) {
        notificationDAO.insertNoti(dto);
        notificationDAO.insertNotiUser(dto);
    }

    @Transactional
    public void insertNotiWorkshop(NotificationDTO dto){
        notificationDAO.insertNoti(dto);
        notificationDAO.insertNotiWorkshop(dto);
    }
}
