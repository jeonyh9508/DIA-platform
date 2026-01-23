package com.project.dia.service;

import com.project.dia.dao.VisitLogDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VisitLogService implements VisitLogDAO {
    @Autowired
    private VisitLogDAO visitLogDAO;

    @Override
    public void insertLog(Integer workshopId, Integer programId, Integer userId) {
        visitLogDAO.insertLog(workshopId, programId, userId);
    }
}
