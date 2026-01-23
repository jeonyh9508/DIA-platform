package com.project.dia.controller.eCommerce.workshop;

import com.project.dia.model.dto.*;
import com.project.dia.model.vo.User;
import com.project.dia.model.vo.Workshop;
import com.project.dia.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workshop")

public class WorkshopController {

    private final WorkshopService workshopService;
    private final UserService userService;
    private final FollowService followService;
    private final ReviewService reviewService;
    private final ReservationService reservationService;
    private final NotificationService notificationService;

    @GetMapping("/home")
    public List<Workshop> home(@RequestParam(name="ownerId") int ownerId){
        List<Workshop> list = workshopService.selectMW(ownerId);

        return list;
    }

    @GetMapping("/info")
    public Workshop workshopInfo(int workshopId){
        return workshopService.selectOne(workshopId);
    }

    @PostMapping("/ws-insert")
    public int workshopAdd(@RequestPart("workshop") Workshop workshop, @RequestPart(value = "file", required = false) MultipartFile file){
        int workshopId = workshopService.workshopAdd(workshop, file);

        return workshopId;
    }

    @PostMapping("/ws-modify")
    public void workshopModify(@RequestPart("workshop") Workshop workshop, @RequestPart(value = "file", required = false) MultipartFile file){
        workshopService.workshopModify(workshop, file);
    }

    @PostMapping("/ws-del")
    public void workshopDel(@RequestBody Workshop workshop){
        workshopService.workshopDel(workshop);
    }

    @GetMapping("/my")
    public User ownerMy(@RequestParam("ownerId") int userId){
        return userService.selectOne(userId);
    }

    @PostMapping("/owner-modify")
    public void ownerModify(
            @RequestPart("ownerData") User user,
            @RequestPart(value = "profileImageFile", required = false) MultipartFile file
    ) {
        userService.modiProfileUser(user, file);
    }

    @PostMapping("/owner-quit")
    public void ownerQuit(@RequestParam("ownerId") int userId){
        userService.quitUser(userId);
    }

    @GetMapping("/follow")
    public List<FollowDTO> followList(@RequestParam("workshopId") int workshopId){
        return followService.followList(workshopId);
    }

    @GetMapping("/review")
    public List<ReviewDTO> wsReview(WorkshopDTO dto){
        return reviewService.wsReview(dto);
    }

    @GetMapping("/reservation")
    public List<ReservationDTO> wsReservation(WorkshopDTO dto){
        return reservationService.wsReservation(dto);
    }

    @GetMapping("/notification")
    public List<NotificationUserDTO> wsNotification(@RequestParam("workshopId") int workshopId){
        return notificationService.wsNotice(workshopId);
    }

    @PostMapping("/notification/read")
    public void wsNoticeRead(@RequestBody NotificationUserDTO dto){
        notificationService.wsNoticeRead(dto.getNotificationId());
    }

    @PostMapping("/reject-reason")
    public WorkshopDTO workshopReject(@RequestBody WorkshopDTO dto){
        return workshopService.workshopReject(dto.getWorkshopId());
    }

}
