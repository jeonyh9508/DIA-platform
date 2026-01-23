package com.project.dia.service;

import com.project.dia.dao.ProgramDAO;
import com.project.dia.dao.ReviewDAO;
import com.project.dia.dao.WorkshopDAO;
import com.project.dia.model.dto.FileUploadDTO;
import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.model.dto.ReviewDTO;
import com.project.dia.model.dto.WorkshopDTO;
import com.project.dia.model.vo.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewDAO reviewDAO;
    @Autowired
    private FileUploadService fileUploadService;
    @Autowired
    private WorkshopDAO workshopDAO;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ProgramDAO programDAO;


    public List<ReviewDTO> selectAll(int programId) {
        return reviewDAO.selectAll(programId);
    }

    public int selectAllCount(int programId) {
        return reviewDAO.selectAllCount(programId);
    }

    public double selectRating(int programId) {
        return reviewDAO.selectRating(programId);
    }

    public List<ReviewDTO> selectMyReview(int userId) {
        return reviewDAO.selectMyReview(userId);
    }

    public List<ReviewDTO> wsReview(WorkshopDTO dto) {
        return reviewDAO.wsReview(dto);
    }

    public void insertReview(ReviewDTO dto, MultipartFile file) {

        Review review = new Review();
        review.setUserId(dto.getUserId());
        review.setProgramId(dto.getProgramId());
        review.setRating(dto.getRating());
        review.setReservationId(dto.getReservationId());
        review.setContent(dto.getContent());

        reviewDAO.insertReview(review);

        reviewDAO.averageRating(dto.getWorkshopId());

        if (file != null && !file.isEmpty()) {
            FileUploadDTO fileUpload = new FileUploadDTO();
            fileUpload.setTable("review");
            fileUpload.setTableId(review.getProgramId());
            fileUpload.setType("ONE");
            fileUpload.setColName("review_image"); // 실제 DB 컬럼명

            try {
                String fileName = fileUploadService.uploadFiles(fileUpload, List.of(file)).get(0);
                review.setReviewImage(fileName);

                reviewDAO.reviewImage(review);
            } catch (IOException e) {
                throw new RuntimeException("워크샵 이미지 업로드 실패", e);
            }
        }
        int dtoWorkshopId = dto.getWorkshopId();

        int ownerId = workshopDAO.selectOne(dtoWorkshopId).getOwnerId();

        NotificationDTO noti = new NotificationDTO();
        noti.setSenderId(dto.getUserId());
        noti.setTargetType("WORKSHOP");
        noti.setWorkshopId(dtoWorkshopId);
        noti.setUserId(ownerId);
        noti.setMessage("새로운 리뷰가 등록되었습니다.");
        noti.setType("REVIEW");
        notificationService.insertNotiWorkshop(noti);
    }

    public int deleteReview(int reviewId) {
        int programId = reviewDAO.findReview(reviewId).getProgramId();
        int workshopId = programDAO.selectOne(programId).getWorkshopId();

        int result = reviewDAO.deleteReview(reviewId);

        reviewDAO.averageRating(workshopId);

        return result;
    }

    public int updateReview(ReviewDTO dto, MultipartFile file) {
        // 1) 텍스트 수정
        int result = reviewDAO.updateReview(dto);

        int programId = reviewDAO.findReview(dto.getReviewId()).getProgramId();
        int workshopId = programDAO.selectOne(programId).getWorkshopId();

        reviewDAO.averageRating(workshopId);


        // 2) 파일 있을 때만 이미지 업데이트
        if (file != null && !file.isEmpty()) {
            FileUploadDTO fileUpload = new FileUploadDTO();
            fileUpload.setTable("review");
            fileUpload.setTableId(dto.getProgramId());
            fileUpload.setType("ONE");
            fileUpload.setColName("review_image");

            try {
                String fileName = fileUploadService.uploadFiles(fileUpload, List.of(file)).get(0);
                dto.setReviewImage(fileName);

                //  여기서 기존 쿼리 활용!
                Review review = new Review();
                review.setReviewId(dto.getReviewId());   // ← 매우 중요!!
                review.setReviewImage(fileName);
                reviewDAO.reviewImage(review);

            } catch (IOException e) {
                throw new RuntimeException("리뷰 이미지 수정 실패", e);
            }
        }

        return result;
    }


    public int reviewExist(ReviewDTO dto){
        return reviewDAO.reviewExist(dto);
    }
}
