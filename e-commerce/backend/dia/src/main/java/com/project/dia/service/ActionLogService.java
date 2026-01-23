package com.project.dia.service;

import com.project.dia.dao.ActionLogDAO;
import com.project.dia.model.dto.ActionLogDTO;
import com.project.dia.model.dto.PagingDTO;
import com.project.dia.model.dto.ProgramDTO;
import com.project.dia.model.dto.SearchDTO;
import com.project.dia.model.vo.ActionLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActionLogService {

    @Autowired
    private ActionLogDAO actionLogDAO;

    public int insertActionLog(ActionLog actionLog) {
        return actionLogDAO.insertActionLog(actionLog);
    }

    public List<ActionLogDTO> actionLogList(ActionLogDTO dto) {
        return actionLogDAO.actionLogList(dto);
    }

    public int countActionLog(ActionLogDTO dto) {
        return actionLogDAO.countActionLog(dto);
    }

    public PagingDTO<ActionLogDTO> getActionLogList(ActionLogDTO dto) {

        List<ActionLogDTO> content = actionLogDAO.actionLogList(dto);
        int totalElements = actionLogDAO.countActionLog(dto);
        return new PagingDTO<>(content, totalElements, dto.getPage(), dto.getLimit());
    }


    public PagingDTO<ActionLogDTO> approvalLogList(SearchDTO search) {
        int offset = (search.getPage() - 1) * search.getSize();
        search.setOffset(offset);

        List<ActionLogDTO> content = actionLogDAO.approvalLogList(search);

        int total = actionLogDAO.countApprovalLog(search);

        return new PagingDTO<>(content, total, search.getPage(), search.getSize());
    }

}
