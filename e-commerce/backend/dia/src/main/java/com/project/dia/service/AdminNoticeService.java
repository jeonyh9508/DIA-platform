package com.project.dia.service;

import com.project.dia.dao.AdminNoticeDAO;
import com.project.dia.dao.UserDAO;
import com.project.dia.model.dto.AdminNoticeDTO;
import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.vo.AdminNotice;
import com.project.dia.model.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminNoticeService implements AdminNoticeDAO {

    @Autowired
    private AdminNoticeDAO adminNoticeDAO;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserDAO userDAO;


    @Override
    public List<AdminNoticeDTO> noticeAll() {
        return adminNoticeDAO.noticeAll();
    }

    @Override
    public AdminNoticeDTO noticeOne(int adminNoticeId) {
        return adminNoticeDAO.noticeOne(adminNoticeId);
    }

    @Override
    public int noticeAdd(AdminNotice adminNotice) {

        if(adminNotice.getNoticeType().equals("고객")){
            NotificationDTO noti = new NotificationDTO();
            noti.setSenderId(adminNotice.getUserId());
            noti.setTargetType("USER");
            noti.setMessage("새 공지가 있습니다. - " + adminNotice.getNoticeContent());
            noti.setType("공지");
            List<Integer> idList = new ArrayList<>();
            for(User user : userDAO.userList()){
                idList.add(user.getUserId());
            }
            noti.setIdList(idList);
            notificationService.sendNotification(noti);
        }
        return adminNoticeDAO.noticeAdd(adminNotice);
    }

    @Override
    public int noticeModi(AdminNotice adminNotice) {
        return adminNoticeDAO.noticeModi(adminNotice);
    }

    @Override
    public int noticeDel(int adminNoticeId) {
        return adminNoticeDAO.noticeDel(adminNoticeId);
    }
}
