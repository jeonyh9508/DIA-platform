package com.project.dia.controller;

import com.project.dia.model.dto.ReservationDTO;
import com.project.dia.model.vo.Reservation;
import com.project.dia.service.PaymentService;
import com.project.dia.service.ReservationService;
import com.project.dia.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/reservation")
@CrossOrigin("*")
public class ReservationController {

    private final ReservationService reservationService;
    private final PaymentService paymentService;
    private final ScheduleService scheduleService;

    @PostMapping("/insert-reservation")
    public int insertReservation(@RequestBody Reservation reservation) {
        return reservationService.insertReservation(reservation);
    }

    @PostMapping("/add-reservation")
    public ReservationDTO addReservation(@RequestBody Reservation reservation) {
        int result = reservationService.insertReservation(reservation);

        if (result == 1) {
            return reservationService.selectRVDetail(reservation.getReservationId());
        } else {
            return null;
        }
    }

    @PostMapping("/update-reservation")
    public int updateReservation(@RequestBody Reservation reservation) {
        return reservationService.updateReservation(reservation);
    }

    @PostMapping("/cancel-reservation")
    public int cancelReservation(@RequestBody Reservation reservation) {
        return reservationService.cancelReservation(reservation);
    }

}
