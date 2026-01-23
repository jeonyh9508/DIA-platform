package com.project.dia.controller;

import com.project.dia.model.vo.NotificationUser;
import com.project.dia.service.NotificationService;
import com.project.dia.service.NotificationUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/notification")
@CrossOrigin("*")
public class NotificationUserController {

    private final  NotificationUserService notificationUserService;

    @PostMapping("/update-notification")
    public int updateViewedOne(@RequestParam int id) {
        return notificationUserService.updateViewedOne(id);
    }

    @PostMapping("update-notifications")
    public int updateViewedList(@RequestBody List<Integer> ids) {
        return notificationUserService.updateViewedList(ids);
    }

    @PostMapping("/delete-notifications")
    public int deleteNotifications(@RequestBody List<Integer> ids) {
        return notificationUserService.deleteNotifications(ids);
    }

}
