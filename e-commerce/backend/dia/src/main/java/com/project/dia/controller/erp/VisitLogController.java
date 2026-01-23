package com.project.dia.controller.erp;

import com.project.dia.config.security.PrincipalDetails;
import com.project.dia.model.vo.User;
import com.project.dia.model.vo.VisitLog;
import com.project.dia.service.VisitLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/erp-system")
@CrossOrigin("*")
public class VisitLogController {
    private final VisitLogService visitLogService;

    @PostMapping("/visit-log")
    public void visitLog(
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            @RequestBody VisitLog vo
    ){
        Integer userId = null;
        if (principalDetails != null) {
            userId = principalDetails.getUser().getUserId();
        }

        visitLogService.insertLog(vo.getWorkshopId(), vo.getProgramId(), userId);
    }
}
