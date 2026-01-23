package com.project.dia.controller.erp;

import com.project.dia.model.dto.ActionLogDTO;
import com.project.dia.model.dto.PagingDTO;
import com.project.dia.model.dto.SearchDTO;
import com.project.dia.service.ActionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/erp-system/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

    private final ActionLogService actionLogService;

    @PostMapping("/action-log")
    public PagingDTO<ActionLogDTO> actionLogList(@RequestBody ActionLogDTO dto){
        return actionLogService.getActionLogList(dto);
    }

    @GetMapping("/approval-log")
    public PagingDTO<ActionLogDTO> approvalList(SearchDTO search) {
        return actionLogService.approvalLogList(search);
    }

}
