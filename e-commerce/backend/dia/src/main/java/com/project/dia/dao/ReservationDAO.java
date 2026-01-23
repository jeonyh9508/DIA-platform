package com.project.dia.dao;

import com.project.dia.model.dto.ReservationDTO;
import com.project.dia.model.dto.WorkshopDTO;
import com.project.dia.model.vo.Reservation;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReservationDAO {

    List<ReservationDTO> selectMyRV(int userId);
    ReservationDTO selectRVDetail(int reservationId);
    List<ReservationDTO> wsReservation(WorkshopDTO dto);
    int insertReservation(Reservation reservation);
    int updateReservation(Reservation reservation);
    List<Integer> findFinishedId();
    void finishReservation(List<Integer> list);
    List<ReservationDTO> viewFinishRV();
    void profitPaid(int reservationId);
    void cancelWaiting(List<Integer> scheduleIds);
}
