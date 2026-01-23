package com.project.dia.controller;

import com.project.dia.model.dto.ReservationDTO;
import com.project.dia.model.dto.ScheduleDTO;
import com.project.dia.model.vo.Payment;
import com.project.dia.model.vo.Reservation;
import com.project.dia.service.PaymentService;
import com.project.dia.service.ReservationService;
import com.project.dia.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/payment")
@CrossOrigin("*")
public class PaymentController {

    private final PaymentService paymentService;
    private final ReservationService reservationService;

    @PostMapping("/add-payment")
    public int addPayment(@RequestBody Payment payment) {
        return reservationService.paymentSuccess(payment);
    }

}
