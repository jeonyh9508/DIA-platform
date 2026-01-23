package com.project.dia.service;

import com.project.dia.dao.WorkshopDAO;
import com.project.dia.model.dto.*;
import com.project.dia.model.vo.ActionLog;
import com.project.dia.model.vo.Program;
import com.project.dia.model.vo.Workshop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class WorkshopService {

    @Autowired
    private WorkshopDAO workshopDAO;
    @Autowired
    private FileUploadService fileUploadService;
    @Autowired
    private ProgramService programService;
    @Autowired
    private ActionLogService actionLogService;
    @Autowired
    private NotificationService notificationService;

    public List<Workshop> selectAll() {
        // 전체 공방
        return workshopDAO.selectAll();
    }

    public Workshop selectOne(int workshopId) {
        // 선택한 공방 조회
        return workshopDAO.selectOne(workshopId);
    }

    public WorkshopDTO selectWorkshop(int programId) {
        // 프로그램 상세보기 페이지용
        return workshopDAO.selectWorkshop(programId);
    }

    public WorkshopDTO selectWorkshopInfo(int workshopId) {
        // 공방 소개 페이지
        return workshopDAO.selectWorkshopInfo(workshopId);
    }

    public List<WorkshopDTO> selectMWP(WorkshopDTO dto) {
        return workshopDAO.selectMWP(dto);
    }

    public List<Workshop> selectMW(int ownerId) {
        // 내 공방 조회
        return workshopDAO.selectMW(ownerId);
    }

    public PagingDTO<WorkshopDTO> selectWorkshopList(SearchDTO search) {
        int offset = (search.getPage() - 1) * search.getSize();
        search.setOffset(offset);

        List<WorkshopDTO> content =  workshopDAO.selectWorkshopList(search);

        int total = workshopDAO.countWorkshopList(search);

        return new PagingDTO<>(content, total, search.getPage(), search.getSize());
    }

    public WorkshopDTO selectWorkshopDetail(int workshopId) {
        return workshopDAO.selectWorkshopDetail(workshopId);
    }

    @Transactional
    public int workshopAdd(Workshop workshop, MultipartFile file) {
        workshopDAO.workshopAdd(workshop);

        if (file != null && !file.isEmpty()) {
            FileUploadDTO dto = new FileUploadDTO();
            dto.setTable("workshop");
            dto.setTableId(workshop.getWorkshopId());
            dto.setType("ONE");
            dto.setColName("profile_img"); // 실제 DB 컬럼명

            try {
                String fileName = fileUploadService.uploadFiles(dto, List.of(file)).get(0);
                workshop.setProfileImg(fileName);

                workshopDAO.workshopProfile(workshop);
            } catch (IOException e) {
                throw new RuntimeException("워크샵 이미지 업로드 실패", e);
            }
        }

        return workshop.getWorkshopId();
    }

    public void workshopModify(Workshop workshop, MultipartFile file) {

        workshopDAO.workshopModify(workshop);
        if (workshop.getApproved().equals("거절")){
            ApprovalDTO dto = new ApprovalDTO();
            dto.setApproved("대기");
            dto.setTargetId(workshop.getWorkshopId());
            workshopDAO.updateWorkshopApproved(dto);
        }
        if (file != null && !file.isEmpty()) {
            FileUploadDTO dto = new FileUploadDTO();
            dto.setTable("workshop");
            dto.setTableId(workshop.getWorkshopId());
            dto.setType("ONE");
            dto.setColName("profile_img");

            try {
                String fileName = fileUploadService.uploadFiles(dto, List.of(file)).get(0);
                workshop.setProfileImg(fileName);

                workshopDAO.workshopProfile(workshop);
            } catch (IOException e) {
                throw new RuntimeException("워크샵 이미지 업로드 실패", e);
            }
        }
    }

    @Transactional
    public void workshopDel(Workshop workshop){
        Program program = new Program();
        program.setWorkshopId(workshop.getWorkshopId());
        program.setActive(workshop.isActive());
        programService.programActive(program);
        workshopDAO.workshopDel(workshop);
    }

    @Transactional
    public int updateWorkshopApproved(ApprovalDTO approval) {
        int result = workshopDAO.updateWorkshopApproved(approval);

        if (result == 1) {
            ActionLog actionLog = new ActionLog();
            actionLog.setTargetType("WORKSHOP");
            actionLog.setTargetId(approval.getTargetId());
            actionLog.setAdminId(approval.getAdminId());
            actionLog.setActionType(approval.getActionType());
            actionLog.setReason(approval.getReason());
            actionLogService.insertActionLog(actionLog);

            // 워크샵 정보 조회 -> 공방명, 공방주 ID
            Workshop workshop = workshopDAO.selectOne(approval.getTargetId());

            NotificationDTO notification = new NotificationDTO();
            notification.setSenderId(approval.getAdminId());
            notification.setTargetType("OWNER");
            notification.setType(approval.getActionType());

            // 알림 메시지 입력
            if ("승인".equals(approval.getActionType())) {
                notification.setMessage("(승인) [" + workshop.getName() + "]" + " 공방이 승인이 완료되었습니다.");
            } else {
                notification.setMessage("(승인 거절) [" + workshop.getName() + "] " + approval.getReason());
            }

            List<Integer> idList = new ArrayList<>();
            idList.add(workshop.getOwnerId());
            notification.setIdList(idList);

            notificationService.sendNotification(notification);
        }

        return result;
    }

    public WorkshopDTO workshopReject (int workshopId) {
        return workshopDAO.workshopReject(workshopId);
    }
}
