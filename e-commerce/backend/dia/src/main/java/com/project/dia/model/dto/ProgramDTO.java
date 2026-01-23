package com.project.dia.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProgramDTO {
    private int programId;        // PK
    private int workshopId;       // FK workshop.workshop_id
    private String title;          // 프로그램 제목
    private String description;    // 프로그램 설명
    private String category;       // 카테고리
    private long price;            // 가격
    private Integer durationMin;      // 소요 시간
    private String difficulty;     // BEGINNER, INTERMEDIATE, ADVANCED
    private String thumb;          // 썸네일 이미지 경로
    private String folder;         // 자료 폴더 경로
    private String status;         // OPEN, CLOSED, CANCELLED
    private String approved;       // PENDING, APPROVED, REJECTED
    private String scheduleType;  // ALWAYS, PERIOD
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date periodStart;     // 기간 시작
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date periodEnd;       // 기간 종료
    private boolean active;        // 소프트 삭제
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date createdAt;       // 생성일

    // user
    private int userId;
    private String userName;
    private String email;

    // workshop
    private String name; // 공방 이름
    private String address; // 공방 주소
    private Integer ownerId; // 공방주 id

    //schedule
    private Integer capacity; // 수용 인원
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date startTime; // 수강 시작일

    //reservation
    private int reservationId;
    private int numPeople;        // 예약 인원
    private long totalPrice;      // 총 금액

    //review
    private int countReview; // 리뷰 수

    // qna_workshop
    private int countQna; // 문의 수

    //wish
    private int countWish; // 위시리스트 수
    private boolean wished; // 위시 여부

    // search
    private String keyword; // 검색 키워드
    private Integer maxPrice; // 검색 최대 금액
    private Integer minPrice; // 검색 최소 금액
    private String region; // 검색 지역
    private String sortOption; // 검색 정렬 조건
//    private double averageRating; // 별점
    private List<String> difficultyList; // 프로그램 난이도 조건 (중복 선택 가능하도록 list)
    private String profileImg; // 워크샵 프로필 사진
    private Double avgRating; // 프로그램 리뷰 평균
    private Integer reviewCount; //리뷰 개수


    //rejectReason
    private String reason;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date logCreatedAt;

}
