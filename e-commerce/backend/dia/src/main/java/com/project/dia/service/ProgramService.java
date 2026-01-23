package com.project.dia.service;

import com.project.dia.dao.ProgramDAO;

import com.project.dia.dao.ProgramImageDAO;
import com.project.dia.dao.WorkshopDAO;
import com.project.dia.model.dto.*;
import com.project.dia.model.vo.ActionLog;
import com.project.dia.model.vo.Program;
import com.project.dia.model.vo.ProgramImage;
import com.project.dia.model.vo.Workshop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProgramService {

    @Autowired
    private ProgramDAO programDAO;
    @Autowired
    private FileUploadService fileUploadService;
    @Autowired
    private ProgramImageDAO programImageDAO;
    @Autowired
    private WorkshopDAO workshopDAO;
    @Autowired
    private ActionLogService actionLogService;
    @Autowired
    private NotificationService notificationService;


    public List<ProgramDTO> selectAll() {
        return programDAO.selectAll();
    }

    public Program selectOne(int programId) {
        return programDAO.selectOne(programId);
    }

    public ProgramDTO selectProgramInfo(int programId) {
        return programDAO.selectProgramInfo(programId);
    }

    public List<ProgramDTO> selectPrograms(int workshopId) {
        return programDAO.selectPrograms(workshopId);
    }

    public List<String> categoryAll(){
        return programDAO.categoryAll();
    }

    public List<ProgramDTO> programSearch(ProgramDTO dto){
        return programDAO.programSearch(dto);
    }

    public List<ProgramDTO> selectCP(int userId) {
        return programDAO.selectCP(userId);
    }

    public void programModi(Program program){
       if(program.getApproved().equals("거절")) {
          ApprovalDTO dto = new ApprovalDTO();
          dto.setApproved("대기");
          dto.setTargetId(program.getProgramId());
          programDAO.updateProgramApproved(dto);
       }
        programDAO.programModi(program);
    }

    public void programActive(Program program){
        programDAO.programActive(program);
    }

    public PagingDTO<ProgramDTO> selectProgramList(SearchDTO search) {
        int offset = (search.getPage() - 1) * search.getSize();
        search.setOffset(offset);

        List<ProgramDTO> content = programDAO.selectProgramList(search);

        int total = programDAO.countProgramList(search);

        return new PagingDTO<>(content, total, search.getPage(), search.getSize());
    }

    public ProgramDTO selectProgramDetail(int programId) {
        return programDAO.selectProgramDetail(programId);
    }

    @Transactional
    public int updateProgramApproved(ApprovalDTO approval) {
        int result = programDAO.updateProgramApproved(approval);

        if (result == 1) {
            // 활동 로그 INSERT
            ActionLog actionLog = new ActionLog();
            actionLog.setTargetType("PROGRAM");
            actionLog.setTargetId(approval.getTargetId());
            actionLog.setAdminId(approval.getAdminId());
            actionLog.setActionType(approval.getActionType());
            actionLog.setReason(approval.getReason());
            actionLogService.insertActionLog(actionLog);

            // 프로그램 조회 → 프로그램 제목, 워크샵 ID
            Program program = programDAO.selectOne(approval.getTargetId());

            // 알림 생성
            NotificationDTO notification = new NotificationDTO();
            notification.setSenderId(approval.getAdminId());
            notification.setTargetType("OWNER");
            notification.setType(approval.getActionType());

            // 알림 메시지 입력
            if ("승인".equals(approval.getActionType())) {
                notification.setMessage("(승인) [" + program.getTitle() + "]" + " 프로그램이 승인되었습니다.");
            } else {
                notification.setMessage("(승인 거절) [" + program.getTitle() + "] " + approval.getReason());
            }

            // 워크샵 정보 조회 -> 공방주 ID
            Workshop workshop = workshopDAO.selectOne(program.getWorkshopId());

            List<Integer> idList = new ArrayList<>();
            idList.add(workshop.getOwnerId());
            notification.setIdList(idList);

            notificationService.sendNotification(notification);
        }

        return result;
    }

    @Transactional
    public int programAdd(Program program, MultipartFile thumb, List<MultipartFile> files) {
        programDAO.programAdd(program);
        int programId = program.getProgramId();

        if (thumb != null && !thumb.isEmpty()) {
            FileUploadDTO thumbDto = new FileUploadDTO();
            thumbDto.setTable("program");
            thumbDto.setTableId(programId);
            thumbDto.setWorkshopId(program.getWorkshopId());
            thumbDto.setType("ONE");
            thumbDto.setColName("thumb"); // program.thumb 컬럼

            try {
                String thumbFileName = fileUploadService.uploadFiles(thumbDto, List.of(thumb)).get(0);
                program.setThumb(thumbFileName);
                programDAO.programThumb(program); // DB 컬럼 업데이트
            } catch (IOException e) {
                throw new RuntimeException("프로그램 썸네일 업로드 실패", e);
            }
        }

        if (files != null && !files.isEmpty()) {
            FileUploadDTO multiDto = new FileUploadDTO();
            multiDto.setTable("program");
            multiDto.setTableId(programId);
            multiDto.setWorkshopId(program.getWorkshopId());
            multiDto.setType("MORE");

            try {
                fileUploadService.uploadFiles(multiDto, files);
            } catch (IOException e) {
                throw new RuntimeException("프로그램 이미지 업로드 실패", e);
            }
        }

        return programId;
    }
    public List<ProgramImage> programImages(int programId){
        return programDAO.programImages(programId);
    }

    public int getImgNo(int programId){
        return programImageDAO.getImgNo(programId);
    }

    public ProgramDTO programReject (int programId) {
        return programDAO.programReject(programId);
    }
}
