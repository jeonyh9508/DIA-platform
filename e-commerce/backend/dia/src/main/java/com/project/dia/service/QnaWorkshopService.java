package com.project.dia.service;

import com.project.dia.dao.ProgramDAO;
import com.project.dia.dao.QnaWorkshopDAO;
import com.project.dia.dao.WorkshopDAO;
import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.dto.QnaWorkshopDTO;
import com.project.dia.model.vo.Program;
import com.project.dia.model.vo.QnaWorkshop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class QnaWorkshopService implements QnaWorkshopDAO {

    @Autowired
    private QnaWorkshopDAO qnaWorkshopDAO;
    @Autowired
    private ProgramDAO programDAO;
    @Autowired
    private WorkshopDAO workshopDAO;
    @Autowired
    private NotificationService notificationService;


    @Override
    public List<QnaWorkshopDTO> selectAll(int programId) {
        return qnaWorkshopDAO.selectAll(programId);
    }

    @Override
    public QnaWorkshopDTO selectOne(int qnaId) {
        return qnaWorkshopDAO.selectOne(qnaId);
    }

    @Override
    public int selectAllCount(int programId) {
        return qnaWorkshopDAO.selectAllCount(programId);
    }

    @Override
    public List<QnaWorkshopDTO> selectMyQna(int userId) {
        return qnaWorkshopDAO.selectMyQna(userId);
    }

    @Override
    public List<QnaWorkshopDTO> qnaWorkshop(int workshopId) {
        return qnaWorkshopDAO.qnaWorkshop(workshopId);
    }

    @Override
    @Transactional
    public int qnaWsAnswer(QnaWorkshop workshop) {
        int result = qnaWorkshopDAO.qnaWsAnswer(workshop);

        if (result == 1) {
            QnaWorkshopDTO dto = qnaWorkshopDAO.selectOne(workshop.getQnaId());
            Program program = programDAO.selectOne(dto.getProgramId());

            NotificationDTO notification = new NotificationDTO();
            notification.setSenderId(null);
            notification.setTargetType("USER");
            notification.setWorkshopId(program.getWorkshopId());
            notification.setUserId(dto.getUserId());
            notification.setMessage("[" + program.getTitle() + "] 프로그램의 문의하신 내용에 대한 답변이 등록되었습니다.");
            notification.setType("QNA");

            List<Integer> idList = new ArrayList<>();
            idList.add(dto.getUserId());
            notification.setIdList(idList);
            notificationService.sendNotification(notification);
        }

        return result;
    }

    @Override
    @Transactional
    public int insertQna(QnaWorkshop workshop) {
        int result = qnaWorkshopDAO.insertQna(workshop);

        if (result == 1) {
            int workshopId = programDAO.selectOne(workshop.getProgramId()).getWorkshopId();
            int ownerId = workshopDAO.selectOne(workshopId).getOwnerId();

            NotificationDTO dto = new NotificationDTO();
            dto.setSenderId(null);
            dto.setTargetType("WORKSHOP");
            dto.setWorkshopId(workshopId);
            dto.setUserId(ownerId);
            dto.setMessage("새로운 문의 사항이 있습니다.");
            dto.setType("QNA");
            notificationService.insertNotiWorkshop(dto);
        }

        return result;
    }

    @Override
    public int deleteQna(int qnaId) {
        return qnaWorkshopDAO.deleteQna(qnaId);
    }
}
