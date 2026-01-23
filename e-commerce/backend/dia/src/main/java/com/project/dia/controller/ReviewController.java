package com.project.dia.controller;

import com.project.dia.model.dto.ReviewDTO;
import com.project.dia.service.ReviewService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/review")
@CrossOrigin("*")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/delete-review")
    public int deleteReview(int reviewId) {
        return reviewService.deleteReview(reviewId);
    }

    @PostMapping("/update-review")
    public int updateReview(
            @RequestPart("review") ReviewDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return reviewService.updateReview(dto, file);
    }


    @PostMapping("/insert")
    public void insertReview(@RequestPart("review") ReviewDTO dto, @RequestPart(value = "file", required = false) MultipartFile file) {
        reviewService.insertReview(dto, file);
    }

    @PostMapping("/exist-check")
    public int reviewExist(@RequestBody ReviewDTO dto){
        return reviewService.reviewExist(dto);
    }
}
