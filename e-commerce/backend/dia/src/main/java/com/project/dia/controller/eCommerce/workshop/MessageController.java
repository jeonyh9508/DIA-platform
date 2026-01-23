package com.project.dia.controller.eCommerce.workshop;

import com.project.dia.model.dto.NotificationDTO;
import com.project.dia.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workshop/send")
@CrossOrigin(origins = "*")
public class MessageController {

    private final NotificationService notificationService;

    @PostMapping("/message")
    public void sendNotification(@RequestBody NotificationDTO dto) {
        notificationService.sendNotification(dto);
    }
}
