package com.project.dia.controller.erp;

import com.project.dia.config.security.PrincipalDetails;
import com.project.dia.model.dto.AdminRoleDTO;
import com.project.dia.model.vo.User;
import com.project.dia.service.AdminRoleService;
import com.project.dia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/erp-system")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminRoleController {
    private final AdminRoleService adminRoleService;
    private final UserService userService;


    @GetMapping("/admin/list")
    public List<AdminRoleDTO> adminList() {
        return adminRoleService.adminList();
    }

    @PostMapping("/admin/register")
    @ResponseBody
    public String adminRegister(@RequestBody AdminRoleDTO dto) {
        return adminRoleService.adminRegister(dto);
    }

    @PostMapping("/admin/delete")
    public int deleteAdmin(@RequestBody AdminRoleDTO dto) {
        int res = adminRoleService.deleteAdmin(dto);

        return res;
    }

    @PostMapping("/admin/update")
    @ResponseBody
    public String updateAdmin(
            @RequestBody AdminRoleDTO dto,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        boolean isSuper = principalDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER"));

        String res = adminRoleService.updateAdmin(dto, isSuper);

        return res;
    }
}
