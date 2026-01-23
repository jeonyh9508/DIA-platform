package com.project.dia.controller.eCommerce.workshop;

import com.project.dia.model.dto.ProfitDTO;
import com.project.dia.model.vo.Profit;
import com.project.dia.service.ProfitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workshop/profit")
@CrossOrigin(origins = "*")
public class ProfitController {

    private final ProfitService profitService;

    @PostMapping("/all")
    public List<ProfitDTO> profitAll(@RequestBody ProfitDTO dto) {
        return profitService.profitAll(dto);
    }

    @PostMapping("/workshop")
    public List<ProfitDTO> profitWorkshop(@RequestBody ProfitDTO dto) {
        return profitService.profitWorkshop(dto);
    }

    @PostMapping("/program")
    public List<ProfitDTO> profitProgram(@RequestBody ProfitDTO dto) {
        return profitService.profitProgram(dto);
    }

    @PostMapping("/graph")
    public List<ProfitDTO> profitGraph(@RequestBody ProfitDTO dto) {
        return profitService.profitGraph(dto);
    }

    @PostMapping("/view")
    public List<ProfitDTO> profitView(@RequestBody ProfitDTO dto) {
        return profitService.profitView(dto.getWorkshopId());
    }

    @PostMapping("/view-program")
    public List<ProfitDTO> profitProgramView(@RequestBody ProfitDTO dto) {
        return profitService.profitProgramView(dto);
    }

    @PostMapping("/pay-profit")
    public void payProfit(@RequestBody ProfitDTO dto) {
        profitService.payProfit(dto);
    }
}
