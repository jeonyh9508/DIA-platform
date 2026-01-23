package com.project.dia.dao;

import com.project.dia.model.dto.ActionLogDTO;
import com.project.dia.model.dto.SearchDTO;
import com.project.dia.model.vo.ActionLog;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ActionLogDAO {

    int insertActionLog(ActionLog actionLog);
    List<ActionLogDTO> actionLogList(ActionLogDTO dto);
    int countActionLog(ActionLogDTO dto);
    List<ActionLogDTO> approvalLogList(SearchDTO search);
    int countApprovalLog(SearchDTO search);

}
