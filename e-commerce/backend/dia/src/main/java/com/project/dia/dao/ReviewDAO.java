package com.project.dia.dao;

import com.project.dia.model.dto.ReviewDTO;
import com.project.dia.model.dto.WorkshopDTO;
import com.project.dia.model.vo.Review;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReviewDAO {
    List<ReviewDTO> selectAll(int programId);
    int selectAllCount(int programId);
    double selectRating(int programId);
    List<ReviewDTO> selectMyReview(int userId);
    List<ReviewDTO> wsReview(WorkshopDTO dto);
    int deleteReview(int reviewId);
    void insertReview(Review review);
    void reviewImage(Review review);
    void averageRating(int workshopId);
    int updateReview(ReviewDTO dto);
    int reviewExist (ReviewDTO dto);
    Review findReview(int reviewId);
}
