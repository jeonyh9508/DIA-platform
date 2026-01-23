package com.project.dia.service;

import com.project.dia.dao.AdminNoticeDAO;
import com.project.dia.dao.AdminRoleDAO;
import com.project.dia.dao.UserDAO;
import com.project.dia.model.dto.AdminNoticeDTO;
import com.project.dia.model.dto.AdminRoleDTO;
import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.vo.AdminNotice;
import com.project.dia.model.vo.AdminRole;
import com.project.dia.model.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminRoleService {
    @Autowired
    private AdminRoleDAO adminRoleDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<AdminRole> findByUserId(int userId) {
        return List.of();
    }

    public List<AdminRoleDTO> adminList() {
        return adminRoleDAO.adminList();
    }

    @Transactional
    public String adminRegister(AdminRoleDTO dto) {
        User duplicateUser = userDAO.userEmail(dto.getEmail());

        if( duplicateUser == null ) {
            String encode = passwordEncoder.encode("qwer1234!");
            dto.setPassword(encode);

            System.out.println("제네키 확인1: " + dto);
            adminRoleDAO.adminRegister(dto);
            System.out.println("제네키 확인2: " + dto);
            adminRoleDAO.insertAdminRole(dto);

            return "등록 완료";
        } else {
            return "중복 이메일이 존재합니다";
        }
    }

    @Transactional
    public int deleteAdmin(AdminRoleDTO dto) {
        int res = adminRoleDAO.deleteAdminRole(dto.getAdminRoleId());
        userDAO.quitUser(dto.getUserId());
        return res;
    }

    @Transactional
    public String updateAdmin(AdminRoleDTO dto, boolean isSuper) {
        User user = userDAO.userEmail(dto.getEmail());
        if( user != null && user.getUserId() != dto.getUserId() ) {
            return "이미 존재하는 이메일입니다.";
        }

        adminRoleDAO.updateAdmin(dto);

        if( isSuper ) {
            adminRoleDAO.updateAdminRole(dto);
        }

        return "수정 완료";
    }
}
