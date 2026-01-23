package com.project.dia.controller;

import com.project.dia.config.security.PrincipalDetails;
import com.project.dia.model.dto.*;
import com.project.dia.model.vo.*;
import com.project.dia.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
 // React dev 서버 허용
public class PageController {
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private final WorkshopService workshopService;
    private final ProgramService programService;
    private final ScheduleService scheduleService;
    private final ReviewService reviewService;
    private final QnaWorkshopService qnaWorkshopService;
    private final UserService userService;
    private final FollowService followService;
    private final WishService wishService;
    private final ReservationService reservationService;
    private final NotificationUserService notificationUserService;

    // 홈 화면 데이터(JSON 반환)
    @GetMapping({"/customer", "/customer/home"})
    public Map<String, Object> home() {
        List<Workshop> workshopList = workshopService.selectAll();
        List<ProgramDTO> programList = programService.selectAll();
        List<String> categoryList = programService.categoryAll();

        Map<String, Object> response = new HashMap<>();

        response.put("workshops", workshopList);
        response.put("programs", programList);
        response.put("categories", categoryList);

        return response;
    }

    // 마이페이지
    @GetMapping("/customer/mypage")
    public User mypage(@RequestParam(name="userId") int userId){
        return userService.selectOne(userId);
    }

    // 내 정보 수정
    @PostMapping("/customer/mypage")
    public ResponseEntity<String> mypage(
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            @RequestPart("myData") User vo,
            @RequestPart(value = "profileImageFile", required = false) MultipartFile file,
            @RequestParam(value = "isImageDeleted", required = false) Boolean isImageDeleted){
        try {
            if (principalDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다.");
            }
            User user = principalDetails.getUser();

            if (vo.getPassword() == null || vo.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("현재 비밀번호를 입력해주세요.");
            }

            boolean pwdCheck = passwordEncoder.matches(vo.getPassword(), user.getPassword());

            if(!pwdCheck) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }

            if (file == null || file.isEmpty()) {
                if (Boolean.TRUE.equals(isImageDeleted)) {
                    // 1. 파일 없음 + 삭제 요청 O -> 삭제 (null)
                    vo.setProfileImg(null);
                } else {
                    // 2. 파일 없음 + 삭제 요청 X -> 기존 이미지 유지
                    vo.setProfileImg(user.getProfileImg());
                }
            }

            String savedFileName = userService.modiProfileUser(vo, file);
            return ResponseEntity.ok(savedFileName);
        } catch(IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NullPointerException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("필수 내용을 모두 입력해주세요.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 중 오류가 발생했습니다.");
        }

    }

    // 내 팔로우 리스트
    @GetMapping("/customer/my-follow")
    public List<FollowDTO> myFollow(@RequestParam(name="userId") int userId){
        return followService.selectFollow(userId);
    }

    // 내 위시 리스트
    @GetMapping("/customer/my-wish")
    public List<WishDTO> myWish(@RequestParam(name="userId") int userId){
        return wishService.selectMyWish(userId);
    }

    // 내 위시리스트 on/off
    @PostMapping("/customer/toggle-wish")
    public void toggleWish(@RequestBody WishDTO dto){
        if( "add".equals(dto.getAction()) ){
            wishService.addWish(dto);
        } else if ( "remove".equals(dto.getAction()) ) {
            wishService.deleteWish(dto);
        }
    }

    // 내 결제 및 예약 내역 리스트
    @GetMapping("/customer/my-reservation")
    public List<ReservationDTO> myReservation(@RequestParam(name="userId") int userId){
        List<ReservationDTO> reservationList = reservationService.selectMyRV(userId);

        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy년 M월 d일 (E)");
        SimpleDateFormat timeFormatter = new SimpleDateFormat("a hh:mm");

        for (ReservationDTO dto : reservationList) {
            Date start = dto.getStartTime();
            Date end = dto.getEndTime();

            if (start != null && end != null) {
                String date = dateFormatter.format(start) + ", "
                        + timeFormatter.format(start) + " ~ "
                        + timeFormatter.format(end);

                dto.setScheduleDate(date);
            }
        }

        return reservationList;
    }

    // 내가 수강한(Completed) 프로그램들
    @GetMapping("/customer/my-program")
    public List<ProgramDTO> myCP(@RequestParam(name="userId") int userId){
        return programService.selectCP(userId);
    }

    // 내 알림함
    @GetMapping("/customer/my-notification")
    public PagingDTO<NotificationUserDTO> myNotificationList(
            @RequestParam("userId") int userId,
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value = "filter", defaultValue = "all") String filter
    ) {
        return notificationUserService.myNotificationList(page, size, userId, filter);
    }

    // 알림함 -> 알림창
    @GetMapping("/customer/my-notification-info")
    public NotificationUserDTO getNotification(@RequestParam int id) {
        return notificationUserService.selectOne(id);
    }

    // 헤더 아이콘 -> 알림 팝업
    @GetMapping("/customer/notification-popup")
    public List<NotificationUserDTO> selectNotis(@RequestParam(name="userId") int userId) {
        return notificationUserService.selectNotis(userId);
    }

    // 내 리뷰
    @GetMapping("/customer/my-review")
    public List<ReviewDTO> myReview(@RequestParam(name="userId") int userId){
        System.out.println(reviewService.selectMyReview(userId));
        return reviewService.selectMyReview(userId);
    }

    // 내 문의내역
    @GetMapping("/customer/my-qna")
    public List<QnaWorkshopDTO> myQna(@RequestParam(name="userId") int userId){
        return qnaWorkshopService.selectMyQna(userId);
    }

    // 팔로우 상태 확인 in workshopInfo
    private boolean checkFollowInWorkshop( int userId, int workshopId ) {
        // 유저-공방 팔로우 상태 확인
        Follow follow = new Follow();
        follow.setUserId(userId);
        follow.setWorkshopId(workshopId);

        Follow result = followService.selectOne(follow);
        boolean following = (result != null && result.isActive());

        return following;
    }

    // 위시 상태 확인 in workshopInfo
    private List<ProgramDTO> checkWishInWorkshop(Integer userId, int workshopId, List<ProgramDTO> programList ) {
        if(userId != null) {
            // 유저-프로그램 위시 상태 확인
            WishDTO wish = new WishDTO();
            wish.setUserId(userId);
            wish.setWorkshopId(workshopId);

            List<WishDTO> wishList = wishService.userWishedList(wish);

            for (ProgramDTO p : programList) {
                p.setWished(false);

                for (WishDTO w : wishList) {
                    if (p.getProgramId() == w.getProgramId()) {
                        p.setWished(w.isActive());
                        break;
                    }
                }
            }
        } else {
            // 비로그인(userId == null)이면 위시 모두 제거
            for (ProgramDTO p : programList) {
                p.setWished(false);
            }
        }

        return programList;
    }

    // 워크샵 상세 정보
    @GetMapping("/customer/workshop-info")
    public Map<String, Object> workshopInfo(@RequestParam(name="workshopId") int workshopId,
                                            @RequestParam(name="userId", required = false) Integer userId) {
        WorkshopDTO workshop = workshopService.selectWorkshopInfo(workshopId);
        List<ProgramDTO> programList = programService.selectPrograms(workshopId);
        List<ProgramDTO> isWishedProgramList = checkWishInWorkshop(userId, workshopId, programList);

        // 전체 팔로우 수
        int total = followService.selectTotalFollows(workshopId);
        workshop.setTotalFollows(total);

        Map<String, Object> response = new HashMap<>();
        response.put("workshop", workshop);
        response.put("programList", isWishedProgramList);
        if (userId != null) {
            boolean isFollowing = checkFollowInWorkshop(userId, workshopId);
            response.put("following", isFollowing);
        }

        return response;
    }

    // 프로그램 위시 상태 조회 함수 in programInfo
    private boolean checkWish( int programId, int userId ){
        WishDTO wishDTO = new WishDTO();
        wishDTO.setProgramId(programId);
        wishDTO.setUserId(userId);

        WishDTO result = wishService.selectOne(wishDTO);
        boolean wish = (result != null && result.isActive());
        
        return wish;
    }

    // 프로그램 상세 정보
    @GetMapping("/customer/program-info")
    public Map<String, Object> programInfo(@RequestParam(name="programId") int programId,
                                           @RequestParam(name="userId", required = false) Integer userId) {
        ProgramDTO program = programService.selectProgramInfo(programId);
        WorkshopDTO workshop = workshopService.selectWorkshop(programId);
        List<ScheduleDTO> scheduleList = scheduleService.selectAll(programId);
        List<ReviewDTO> reviewList = reviewService.selectAll(programId);
        List<QnaWorkshopDTO> qnaWorkshopList = qnaWorkshopService.selectAll(programId);

        SimpleDateFormat timeFormatter = new SimpleDateFormat("a hh:mm");

        for (ScheduleDTO schedule : scheduleList) {
            Date start = schedule.getStartTime();
            Date end = schedule.getEndTime();

            if (start != null && end != null) {
                String time = timeFormatter.format(start) + " ~ " + timeFormatter.format(end);

                schedule.setScheduleTime(time);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("program", program);
        response.put("workshop", workshop);
        response.put("scheduleList", scheduleList);
        response.put("reviewList", reviewList);
        response.put("qnaWorkshopList", qnaWorkshopList);
        if(userId != null) {
            response.put("wish", checkWish(programId, userId));
        }

        return response;
    }

    @GetMapping("/customer/search")
    public List<ProgramDTO> programSearch(
            @RequestParam(required = false) List<String> difficultyList,
            @RequestParam(required = false, name = "difficultyList") String difficultyRaw,
            ProgramDTO dto
    ) {
        // difficultyList= 값이 비어있으면 null 처리
        if (difficultyRaw != null && difficultyRaw.trim().isEmpty()) {
            dto.setDifficultyList(null);
        }
        // difficultyList=중급,고급 형태면 split
        else if (difficultyRaw != null && difficultyRaw.contains(",")) {
            dto.setDifficultyList(Arrays.asList(difficultyRaw.split(",")));
        }
        // difficultyList=중급&difficultyList=고급 형태면 그대로 사용
        else if (difficultyList != null && !difficultyList.isEmpty()) {
            dto.setDifficultyList(difficultyList);
        }
        // 기타 케이스
        else {
            dto.setDifficultyList(null);
        }

        return programService.programSearch(dto);
    }



    // 결제 페이지
    @GetMapping("/customer/reservation-info")
    public Map<String, Object> reservationInfo(@RequestParam(name="scheduleId") int scheduleId,
                                               @RequestParam(name="userId") int userId) {
        ScheduleDTO schedule = scheduleService.selectOne(scheduleId);
        User user = userService.selectOne(userId);

        Date start = schedule.getStartTime();
        Date end = schedule.getEndTime();

        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy년 M월 d일 (E)");
        SimpleDateFormat timeFormatter = new SimpleDateFormat("a hh:mm");

        String date = dateFormatter.format(start) + ", "
                + timeFormatter.format(start) + " ~ "
                + timeFormatter.format(end);

        schedule.setScheduleDate(date);

        Map<String, Object> response = new HashMap<>();
        response.put("schedule", schedule);
        response.put("user", user);

        return response;
    }

    // 결제내역 상세보기 페이지
    @GetMapping("/customer/reservation-detail")
    public ReservationDTO ReservationDetail(@RequestParam(name="reservationId") int reservationId) {
        ReservationDTO reservation = reservationService.selectRVDetail(reservationId);

        Date start = reservation.getStartTime();
        Date end = reservation.getEndTime();

        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy년 M월 d일 (E)");
        SimpleDateFormat timeFormatter = new SimpleDateFormat("a hh:mm");

        String date = dateFormatter.format(start);
        String time = timeFormatter.format(start) + " ~ " + timeFormatter.format(end);

        reservation.setScheduleDay(date);
        reservation.setScheduleTime(time);

        return reservation;
    }

    // 기존 예약 이어서 결제용
    @GetMapping("/customer/continue-reservation")
    public Map<String, Object> continueReservation(@RequestParam(name="reservationId") int reservationId) {

        // 예약 정보 가져오기
        ReservationDTO reservation = reservationService.selectRVDetail(reservationId);

        // 사용자 정보 가져오기
        User user = userService.selectOne(reservation.getUserId());

        // 기존 스케줄 일정 가져오기
        ScheduleDTO schedule = scheduleService.selectOne(reservation.getScheduleId());

        Date start = schedule.getStartTime();
        Date end = schedule.getEndTime();

        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy년 M월 d일 (E)");
        SimpleDateFormat timeFormatter = new SimpleDateFormat("a hh:mm");

        String date = dateFormatter.format(start) + ", "
                + timeFormatter.format(start) + " ~ "
                + timeFormatter.format(end);

        schedule.setScheduleDate(date);

        Map<String, Object> response = new HashMap<>();
        response.put("reservation", reservation);
        response.put("user", user);
        response.put("schedule", schedule);

        return response;
    }


}
