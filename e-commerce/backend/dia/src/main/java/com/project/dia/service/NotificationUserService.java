package com.project.dia.service;

import com.project.dia.dao.NotificationUserDAO;
import com.project.dia.dao.ReviewDAO;
import com.project.dia.model.dto.NotificationUserDTO;
import com.project.dia.model.dto.PagingDTO;
import com.project.dia.model.dto.ReviewDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationUserService {

    @Autowired
    private NotificationUserDAO notificationUserDAO;

    public PagingDTO<NotificationUserDTO> myNotificationList(
            int page, int size, int userId, String filter) {

        int offset = (page - 1) * size;

        List<NotificationUserDTO> content =
                notificationUserDAO.selectMyN(userId, size, offset, filter);

        int total = notificationUserDAO.selectMyNCount(userId, filter);

        return new PagingDTO<>(content, total, page, size);
    }

    public NotificationUserDTO selectOne(int id) {
        return notificationUserDAO.selectOne(id);
    }

    public List<NotificationUserDTO> selectNotis(int userId) {
        return notificationUserDAO.selectNotis(userId);
    }

    public int updateViewedOne(int id) {
        return notificationUserDAO.updateViewedOne(id);
    }

    public int updateViewedList(List<Integer> ids) {
        return notificationUserDAO.updateViewedList(ids);
    }

    public int deleteNotifications(List<Integer> ids) {
        return notificationUserDAO.deleteNotifications(ids);
    }


}
