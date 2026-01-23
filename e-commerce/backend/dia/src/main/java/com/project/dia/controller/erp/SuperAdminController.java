package com.project.dia.controller.erp;

import com.project.dia.model.dto.SuperDashboardDTO;
import com.project.dia.service.SuperAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/erp-system")
@CrossOrigin("*")
public class SuperAdminController {
    private final SuperAdminService superAdminService;

    @GetMapping("/dashboard/super")
    public SuperDashboardDTO getDashboard() {
        return superAdminService.getDashboardData();
    }
}
