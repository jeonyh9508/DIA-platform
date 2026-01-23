package com.project.dia.dao;

import com.project.dia.model.dto.ProfitDTO;
import com.project.dia.model.vo.Profit;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProfitDAO {
    List<ProfitDTO> profitAll(ProfitDTO dto);
    List<ProfitDTO> profitWorkshop(ProfitDTO dto);
    List<ProfitDTO> profitProgram(ProfitDTO dto);
    List<ProfitDTO> profitGraph(ProfitDTO dto);
    void upsertMonthly(ProfitDTO dto);
    List<ProfitDTO> profitView(int workshopId);
    List<ProfitDTO> profitProgramView(ProfitDTO dto);
    void payProfit(ProfitDTO dto);
    List<ProfitDTO> profitSettlement();
}
