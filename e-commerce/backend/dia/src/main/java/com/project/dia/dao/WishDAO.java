package com.project.dia.dao;

import com.project.dia.model.dto.UserDTO;
import com.project.dia.model.dto.WishDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WishDAO {

    WishDTO selectCount(int programId);
    List<WishDTO> selectMyWish(int userId);
    Integer checkWish(WishDTO dto);
    void insertWish(WishDTO dto);
    void updateWish(WishDTO dto);
    WishDTO selectOne(WishDTO wish);
    int selectCountWish(int programId);
    List<WishDTO> wishList(int programId);
    List<WishDTO> userWishedList(WishDTO wish);
}
