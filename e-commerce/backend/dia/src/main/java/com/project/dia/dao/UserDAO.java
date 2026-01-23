package com.project.dia.dao;

import com.project.dia.model.dto.UserDTO;
import com.project.dia.model.vo.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserDAO {

    User selectOne(int id);
    int modifyUser(User vo);
    void profileUser(User vo);
    void quitUser(int userId);
    int registerUser(User vo);
    User userEmail(String email);
    int changePwd(User vo);
    List<User> adminList();
    List<User> userList();
}
