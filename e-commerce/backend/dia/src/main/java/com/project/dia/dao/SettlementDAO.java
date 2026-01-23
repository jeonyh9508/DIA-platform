package com.project.dia.dao;

import com.project.dia.model.dto.ProfitDTO;
import com.project.dia.model.dto.SettlementDTO;
import com.project.dia.model.vo.Settlement;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SettlementDAO {
    List<SettlementDTO> selectAll(SettlementDTO dto);
    Settlement selectOne(int settlementId);
    int insertSettlement(ProfitDTO dto);
    int statusUpdate(SettlementDTO dto);
    int adjustSettlement(SettlementDTO dto);
    List<SettlementDTO> settlementChart();
}
