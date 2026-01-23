package com.project.dia.service;

import com.project.dia.dao.ProfitDAO;
import com.project.dia.dao.ReservationDAO;
import com.project.dia.model.dto.ProfitDTO;
import com.project.dia.model.dto.ReservationDTO;
import com.project.dia.model.vo.Profit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ProfitService implements ProfitDAO {

    @Autowired
    private ProfitDAO profitDAO;
    @Autowired
    private ReservationDAO reservationDAO;
    @Autowired
    private SettlementService settlementService;

    @Override
    public List<ProfitDTO> profitAll(ProfitDTO dto) {
        return profitDAO.profitAll(dto);
    }

    @Override
    public List<ProfitDTO> profitWorkshop(ProfitDTO dto) {
        return profitDAO.profitWorkshop(dto);
    }

    @Override
    public List<ProfitDTO> profitProgram(ProfitDTO dto) {
        return profitDAO.profitProgram(dto);
    }

    @Override
    public List<ProfitDTO> profitGraph(ProfitDTO dto) {
        return profitDAO.profitGraph(dto);
    }

    @Override
    public void upsertMonthly(ProfitDTO dto) {
        profitDAO.upsertMonthly(dto);
    }

    @Override
    public List<ProfitDTO> profitView(int workshopId) {
        return profitDAO.profitView(workshopId);
    }

    @Override
    public List<ProfitDTO> profitProgramView(ProfitDTO dto) {
        return profitDAO.profitProgramView(dto);
    }

    @Override
    public void payProfit(ProfitDTO dto) {
        dto.setPaidStatus("정산중");
        settlementService.insertSettlement(dto);
        profitDAO.payProfit(dto);
    }

    @Override
    public List<ProfitDTO> profitSettlement() {
        return profitDAO.profitSettlement();
    }

    @Transactional
    public void profitSet(ReservationDTO dto){

        ReservationDTO reservationDTO = reservationDAO.selectRVDetail(dto.getReservationId());

        String status = (reservationDTO.getStatus());
        if(status.equals("확정")||status.equals("대기")||status.equals("취소")){
            return;
        }

        if(status.equals("수강종료")) {
            String monthly = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

            ProfitDTO profitDTO = new ProfitDTO();
            profitDTO.setWorkshopId(reservationDTO.getWorkshopId());
            profitDTO.setProgramId(reservationDTO.getProgramId());
            profitDTO.setMonthly(monthly);
            profitDTO.setTotalPrice(reservationDTO.getTotalPrice());

            profitDAO.upsertMonthly(profitDTO);
        }
    }

}
