package com.project.dia.dao;

import com.project.dia.model.dto.ScheduleDTO;
import com.project.dia.model.vo.Schedule;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ScheduleDAO {
    List<ScheduleDTO> selectAll(int programId);
    ScheduleDTO selectOne(int scheduleId);
    void scheduleAdd(ScheduleDTO dto);
    void scheduleModi(ScheduleDTO dto);
    void scheduleDel(int scheduleId);
    int selectAttendees(int scheduleId);
    int addAttendees(ScheduleDTO dto);
    int removeAttendees(ScheduleDTO dto);
    void updateScheduleStatus();
    void updateScheduleOpen();
    List<Integer> findFullSchedules();
    List<Integer> findStartedSchedules();

}
