package com.project.dia.controller.erp;

import com.project.dia.model.dto.ApprovalDTO;
import com.project.dia.model.dto.PagingDTO;
import com.project.dia.model.dto.ProgramDTO;
import com.project.dia.model.dto.SearchDTO;
import com.project.dia.model.vo.ActionLog;
import com.project.dia.service.ActionLogService;
import com.project.dia.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/erp-system/program")
@CrossOrigin("*")
public class ErpProgramController {

    private final ProgramService programService;

    @GetMapping("/list")
    public PagingDTO<ProgramDTO> selectProgramList(SearchDTO search) {
        return programService.selectProgramList(search);
    }

    @PostMapping("/detail")
    public ProgramDTO selectProgramDetail(@RequestParam int programId) {
        return programService.selectProgramDetail(programId);
    }

    @PostMapping("/update-approved")
    public int updateProgramApproved(@RequestBody ApprovalDTO approval) {
        return programService.updateProgramApproved(approval);
    }

}
