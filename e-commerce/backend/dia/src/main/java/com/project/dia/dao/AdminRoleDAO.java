package com.project.dia.dao;

import com.project.dia.model.dto.AdminRoleDTO;
import com.project.dia.model.vo.AdminRole;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminRoleDAO {
    List<AdminRole> findByUserId(int userId);
    List<AdminRoleDTO> adminList();
    void adminRegister(AdminRoleDTO dto);
    void insertAdminRole(AdminRoleDTO dto);
    int deleteAdminRole(int adminRoleId);
    int updateAdmin(AdminRoleDTO dto);
    int updateAdminRole(AdminRoleDTO dto);
}
