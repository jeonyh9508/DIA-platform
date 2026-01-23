package com.project.dia.service;

import com.project.dia.dao.ReviewDAO;
import com.project.dia.dao.WishDAO;
import com.project.dia.model.dto.ReviewDTO;
import com.project.dia.model.dto.WishDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishService {

    @Autowired
    private WishDAO wishDAO;

    public WishDTO selectCount(int programId) {
        return wishDAO.selectCount(programId);
    }

    public List<WishDTO> selectMyWish(int userId) {
        return wishDAO.selectMyWish(userId);
    }

    // wish 추가
    @Transactional
    public Integer addWish(WishDTO dto) {
        // 기존 위시리스트 내역 확인
        Integer checkWish = wishDAO.checkWish(dto);

        if(checkWish == 0) {
            // 없으면 추가
            wishDAO.insertWish(dto);
        } else {
            // 있으면 업데이트(active = 1 로)
            dto.setActive(true);
            wishDAO.updateWish(dto);
        }
        return checkWish;
    }

    // wish 삭제
    public void deleteWish(WishDTO dto) {
        dto.setActive(false);
        wishDAO.updateWish(dto);
    }

    public int checkWish(WishDTO wish) {
        return wishDAO.checkWish(wish);
    }

    public void insertWish(WishDTO wish) {
        wishDAO.insertWish(wish);
    }

    public void updateWish(WishDTO wish) {
        wishDAO.updateWish(wish);
    }

    public WishDTO selectOne(WishDTO wish) {
        return wishDAO.selectOne(wish);
    }

    public int selectCountWish(int programId) {
        return wishDAO.selectCountWish(programId);
    }

    public List<WishDTO> wishList (int programId) {return wishDAO.wishList(programId);}

    public List<WishDTO> userWishedList(WishDTO wish) {
        return wishDAO.userWishedList(wish);
    }
}
