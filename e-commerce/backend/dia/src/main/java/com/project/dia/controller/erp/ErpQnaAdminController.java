package com.project.dia.controller.erp;

import com.project.dia.config.security.PrincipalDetails;
import com.project.dia.model.dto.QnaAdminDTO;
import com.project.dia.model.vo.ActionLog;
import com.project.dia.model.vo.QnaAdmin;
import com.project.dia.service.ActionLogService;
import com.project.dia.service.QnaAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/erp-system/qna-admin")
@CrossOrigin("*")
public class ErpQnaAdminController {

    private final QnaAdminService qnaAdminService;
    private final ActionLogService actionLogService;
    @GetMapping("")
    public List<QnaAdminDTO> selectAllQnaAdmin(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String emailSearch,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        return qnaAdminService.selectAllQnaAdmin(role, status, keyword, emailSearch, search, startDate, endDate);
    }
    @PostMapping("admin-answer")
    public int updateQnaToCustomer(@RequestBody QnaAdminDTO qnaAdminDTO){
        return qnaAdminService.updateQnaToCustomer(qnaAdminDTO);
    }
    @PostMapping("admin-answer-delete")
    public int deleteQnaToCustomer(
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            @RequestBody QnaAdminDTO dto
    ) {
        int adminId = principalDetails.getUser().getUserId();

        // DB에서 최신 문의 내용 다시 가져오기
        QnaAdmin origin = qnaAdminService.findById(dto.getQnaAdminId());

        // reasonText 구성 — DB에서 가져온 내용 기반
        String reasonText =
                "제목: " + origin.getTitle() + "\n" +
                        "내용: " + origin.getContent() + "\n" +
                        "삭제된 답변: " + origin.getAnswer();

        ActionLog log = new ActionLog();
        log.setTargetType("QNA");
        log.setTargetId(dto.getQnaAdminId());
        log.setAdminId(adminId);
        log.setActionType("답변삭제");
        log.setReason(reasonText);

        actionLogService.insertActionLog(log);

        return qnaAdminService.deleteQnaToCustomer(dto);
    }

    @PostMapping("/answer")
    public int answerQna(
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            @RequestBody QnaAdminDTO dto
    ) {

        int result = qnaAdminService.updateQnaToCustomer(dto);
        int adminId = principalDetails.getUser().getUserId();

        // ✔ reason 내용 조합
        String reasonText =
                "제목: " + dto.getTitle() + "\n" +
                "내용: " + dto.getContent() + "\n" +
                "답변: " + dto.getAnswer();

        // ✔ ActionLog 객체 생성
        ActionLog log = new ActionLog();
        log.setTargetType("QNA");

        log.setTargetId(dto.getQnaAdminId());

        log.setAdminId(adminId);
        log.setActionType("답변완료");
        log.setReason(reasonText);

        actionLogService.insertActionLog(log);

        return result;
    }





}
