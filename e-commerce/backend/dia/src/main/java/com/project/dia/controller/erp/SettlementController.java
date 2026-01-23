package com.project.dia.controller.erp;

import com.project.dia.model.dto.ProfitDTO;
import com.project.dia.model.dto.SettlementDTO;
import com.project.dia.model.vo.Settlement;
import com.project.dia.service.ProfitService;
import com.project.dia.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/erp-system/settlement")
@CrossOrigin("*")
public class SettlementController {

    private final SettlementService settlementService;
    private final ProfitService profitService;

    @PostMapping("/view")
    public List<SettlementDTO> selectAll(@RequestBody SettlementDTO dto){
        return settlementService.selectAll(dto);
    }

    @PostMapping("/one")
    public Settlement selectOne(@RequestBody Settlement settlement){
        return settlementService.selectOne(settlement.getSettlementId());
    }

    @PostMapping("/status-update")
    public int statusUpdate(@RequestBody SettlementDTO dto){
        return settlementService.statusUpdate(dto);
    }

    @PostMapping("/unsettled")
    public List<ProfitDTO> profitSettlement(){
        return profitService.profitSettlement();
    }

    @PostMapping("/dashboard")
    public List<SettlementDTO> settlementChart() {
        return settlementService.settlementChart();
    }
}
