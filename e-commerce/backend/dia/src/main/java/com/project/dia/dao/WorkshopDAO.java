package com.project.dia.dao;

import com.project.dia.model.dto.ApprovalDTO;
import com.project.dia.model.dto.SearchDTO;
import com.project.dia.model.dto.WorkshopDTO;
import com.project.dia.model.vo.Workshop;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WorkshopDAO {
    List<Workshop> selectAll();
    Workshop selectOne(int workshopId);
    WorkshopDTO selectWorkshop(int programId);
    WorkshopDTO selectWorkshopInfo(int workshopId);
    List<WorkshopDTO> selectMWP(WorkshopDTO dto);
    List<Workshop> selectMW(int ownerId);
    void workshopAdd(Workshop workshop);
    void workshopProfile(Workshop workshop);
    void workshopModify(Workshop workshop);
    void workshopDel(Workshop workshop);
    int updateWorkshopApproved(ApprovalDTO approval);
    List<WorkshopDTO> selectWorkshopList(SearchDTO search);
    int countWorkshopList(SearchDTO search);
    WorkshopDTO selectWorkshopDetail(int workshopId);
    WorkshopDTO workshopReject(int workshopId);
}
