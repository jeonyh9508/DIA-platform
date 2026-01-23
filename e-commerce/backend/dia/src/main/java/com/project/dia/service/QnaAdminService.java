package com.project.dia.service;

import com.project.dia.dao.QnaAdminDAO;
import com.project.dia.dao.UserDAO;
import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.dto.QnaAdminDTO;
import com.project.dia.model.vo.QnaAdmin;
import com.project.dia.model.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QnaAdminService{

    @Autowired
    private QnaAdminDAO qnaAdminDAO;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserDAO userDAO;


    public int deleteQnaToAdmin(int qnaAdminId){
           return qnaAdminDAO.deleteQnaToAdmin(qnaAdminId);
    }


    public int insertQnaToAdmin(QnaAdmin qnaAdmin) {
        NotificationDTO dto = new NotificationDTO();
        dto.setSenderId(qnaAdmin.getUserId());
        dto.setTargetType("ADMIN");
        dto.setMessage(qnaAdmin.getContent());
        dto.setType("QnaAdmin");
        dto.setUserId(qnaAdmin.getAdminId());
        List<Integer> idList = new ArrayList<>();
        for (User admin : userDAO.adminList()) {  // User 객체라고 가정
            idList.add(admin.getUserId());        // getUserId()로 아이디만 추출
        }
        dto.setIdList(idList);

        notificationService.sendNotification(dto);

        return qnaAdminDAO.insertQnaToAdmin(qnaAdmin);
    }


    public int updateQnaToAdmin(QnaAdmin qnaAdmin){
        return qnaAdminDAO.updateQnaToAdmin(qnaAdmin);
    }


    public List<QnaAdmin> qnaAdminView(int userId) {
        return qnaAdminDAO.qnaAdminView(userId);
    }


    public List<QnaAdminDTO> selectAllQnaAdmin(
            String role, String status, String keyword, String emailSearch,
            String search, String startDate, String endDate
    ) {

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("role", emptyToNull(role));
        paramMap.put("status", emptyToNull(status));
        paramMap.put("keyword", emptyToNull(keyword));
        paramMap.put("emailSearch", emptyToNull(emailSearch));
        paramMap.put("search", emptyToNull(search));
        paramMap.put("startDate", emptyToNull(startDate));
        paramMap.put("endDate", emptyToNull(endDate));

        return qnaAdminDAO.selectAllQnaAdmin(paramMap);
    }

    private String emptyToNull(String s) {
        return (s == null || s.trim().isEmpty()) ? null : s;
    }
    @Transactional
    public int updateQnaToCustomer(QnaAdminDTO qnaAdminDTO){

        // 1) DB에 답변 저장
        int result = qnaAdminDAO.updateQnaToCustomer(qnaAdminDTO);

        if(result > 0){

            // 2) 이 문의를 작성한 고객 ID 조회
            int userId = qnaAdminDAO.getUserIdByQnaId(qnaAdminDTO.getQnaAdminId());

            // 3) 알림 메시지 내용 구성
            String message = "관리자 문의 답변 완료 -"
                    + "\n제목: " + qnaAdminDTO.getTitle()
                    + "\n내용: " + qnaAdminDTO.getContent()
                    + "\n답변: " + qnaAdminDTO.getAnswer();

            // 4) 알림 DTO 생성
            NotificationDTO dto = new NotificationDTO();
            dto.setSenderId(qnaAdminDTO.getAdminId());  // 답변한 관리자
            dto.setTargetType("USER");                  // 고객에게 발송
            dto.setType("QNA_ANSWER");
            dto.setMessage(message);
            dto.setIdList(List.of(userId));

            // 5) 알림 발송
            notificationService.sendNotification(dto);
        }

        return result;
    }

    public int deleteQnaToCustomer(QnaAdminDTO qnaAdminDTO){return qnaAdminDAO.deleteQnaToCustomer(qnaAdminDTO);}

    public QnaAdmin findById(int id){
        return qnaAdminDAO.findById(id);
    }

}
