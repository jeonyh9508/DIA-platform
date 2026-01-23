package com.project.dia.controller.erp;

import com.project.dia.model.dto.ApprovalDTO;
import com.project.dia.model.dto.PagingDTO;
import com.project.dia.model.dto.SearchDTO;
import com.project.dia.model.dto.WorkshopDTO;
import com.project.dia.model.vo.ActionLog;
import com.project.dia.model.vo.Workshop;
import com.project.dia.service.ActionLogService;
import com.project.dia.service.WorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/erp-system/workshop")
@CrossOrigin("*")
public class ErpWorkshopController {

    private final WorkshopService workshopService;

    @GetMapping("/list")
    public PagingDTO<WorkshopDTO> selectWorkshopList(SearchDTO search) {
        return workshopService.selectWorkshopList(search);
    }

    @PostMapping("/detail")
    public WorkshopDTO selectWorkshopDetail(@RequestParam int workshopId) {
        return workshopService.selectWorkshopDetail(workshopId);
    }

    @PostMapping("/update-approved")
    public int updateWorkshopApproved(@RequestBody ApprovalDTO approval) {
        return workshopService.updateWorkshopApproved(approval);
    }

}
