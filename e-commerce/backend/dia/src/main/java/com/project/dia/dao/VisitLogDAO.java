package com.project.dia.dao;

import com.project.dia.model.vo.VisitLog;
import org.apache.ibatis.annotations.Mapper;

import java.util.Date;

@Mapper
public interface VisitLogDAO {
    void insertLog(Integer workshopId, Integer programId, Integer userId);
}
