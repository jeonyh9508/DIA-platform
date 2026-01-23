package com.project.dia.service;

import com.project.dia.dao.ProfitDAO;
import com.project.dia.dao.SettlementDAO;
import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.dto.ProfitDTO;
import com.project.dia.model.dto.SettlementDTO;
import com.project.dia.model.vo.ActionLog;
import com.project.dia.model.vo.Settlement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SettlementService {

    @Autowired
    private SettlementDAO settlementDAO;
    @Autowired
    private ProfitDAO profitDAO;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ActionLogService actionLogService;


    public List<SettlementDTO> selectAll(SettlementDTO dto) {
        return settlementDAO.selectAll(dto);
    }

    public Settlement selectOne(int settlementId){
        return settlementDAO.selectOne(settlementId);
    }
    public int insertSettlement(ProfitDTO dto) {
        return settlementDAO.insertSettlement(dto);
    }


    @Transactional
    public int statusUpdate(SettlementDTO dto) {
        ProfitDTO profitDTO = new ProfitDTO();
        profitDTO.setPaidStatus(dto.getStatus());
        profitDTO.setWorkshopId(dto.getWorkshopId());
        profitDTO.setMonthly(dto.getMonthly());
        profitDAO.payProfit(profitDTO);

        String comment = dto.getMonthly().substring(0, 4) + "년 " + dto.getMonthly().substring(5, 7) + "월 공방 " + dto.getWorkshopName() + " " + dto.getStatus() + " 처리";

        ActionLog log = new ActionLog();
        log.setTargetType("SETTLEMENT");
        log.setTargetId(dto.getSettlementId());
        log.setAdminId(dto.getAdminCheckerId());
        log.setActionType(dto.getStatus());
        log.setReason("정산처리 - "+comment);
        actionLogService.insertActionLog(log);

        NotificationDTO noti = new NotificationDTO();
        noti.setSenderId(dto.getAdminCheckerId());
        noti.setTargetType("OWNER");
        noti.setMessage(comment + "되었습니다.");
        noti.setType("정산");
        List<Integer> idList = new ArrayList<>();
        idList.add(dto.getOwnerId());
        noti.setIdList(idList);
        notificationService.sendNotification(noti);

        if (!dto.getStatus().equals("조정")) {
            return settlementDAO.statusUpdate(dto);
        } else {
            return settlementDAO.adjustSettlement(dto);
        }
    }

    public List<SettlementDTO> settlementChart(){
        return  settlementDAO.settlementChart();
    }

}
