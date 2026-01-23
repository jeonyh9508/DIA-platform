package com.project.dia.service;

import com.project.dia.dao.ReservationDAO;
import com.project.dia.dao.ScheduleDAO;
import com.project.dia.model.dto.ScheduleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScheduleService implements ScheduleDAO {

    @Autowired
    private ScheduleDAO scheduleDAO;

    @Autowired
    private ReservationDAO reservationDAO;

    @Override
    public List<ScheduleDTO> selectAll(int programId) {
        return scheduleDAO.selectAll(programId);
    }

    @Override
    public ScheduleDTO selectOne(int scheduleId) {
        return scheduleDAO.selectOne((scheduleId));
    }

    @Override
    public void scheduleAdd(ScheduleDTO dto) {
        scheduleDAO.scheduleAdd(dto);
    }

    @Override
    public void scheduleModi(ScheduleDTO dto) {
        scheduleDAO.scheduleModi(dto);
    }

    @Override
    public void scheduleDel(int scheduleId) {
        scheduleDAO.scheduleDel(scheduleId);
    }

    @Override
    public int selectAttendees(int scheduleId) {
        return scheduleDAO.selectAttendees(scheduleId);
    }

    @Override
    public int addAttendees(ScheduleDTO dto) {
        return scheduleDAO.addAttendees(dto);
    }

    @Override
    public int removeAttendees(ScheduleDTO dto) {
        return scheduleDAO.removeAttendees(dto);
    }

    public void increaseAttendees(int scheduleId, int numPeople) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setScheduleId(scheduleId);
        dto.setNumPeople(numPeople);
        scheduleDAO.addAttendees(dto);
    }

    public void decreaseAttendees(int scheduleId, int numPeople) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setScheduleId(scheduleId);
        dto.setNumPeople(numPeople);
        scheduleDAO.removeAttendees(dto);
    }

    @Override
    public void updateScheduleStatus() {
        scheduleDAO.updateScheduleStatus();
    }

    @Override
    public void updateScheduleOpen() {
        scheduleDAO.updateScheduleOpen();
    }

    @Override
    public List<Integer> findFullSchedules() {
        return scheduleDAO.findFullSchedules();
    }

    @Override
    public List<Integer> findStartedSchedules() {
        return scheduleDAO.findStartedSchedules();
    }

    @Transactional
    @Scheduled(cron = "0 * * * * *") // 매분 0초
    public void updateSchedulesCancel() {
        // Deadlock 방지 -> 조회 후 업데이트로 변경
        // 1) 정원 초과 → 대기 예약 취소
        List<Integer> full = findFullSchedules();
        if (!full.isEmpty()) {
            reservationDAO.cancelWaiting(full);
        }

        // 2) 이미 시작된 스케줄 → 대기 예약 취소
        List<Integer> started = findStartedSchedules();
        if (!started.isEmpty()) {
            reservationDAO.cancelWaiting(started);
        }

        // 3) 스케줄 상태 마감 처리 (start_time 지났거나 정원 초과)
        updateScheduleStatus();

        // 4) 정원 다시 생기면 모집 상태로 재전환 (start_time 이후 제외)
        updateScheduleOpen();
    }


}
