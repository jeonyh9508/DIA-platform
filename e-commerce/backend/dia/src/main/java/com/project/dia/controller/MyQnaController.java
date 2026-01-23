package com.project.dia.controller;
import com.project.dia.model.vo.QnaAdmin;
import com.project.dia.service.QnaAdminService;
import com.project.dia.service.QnaWorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/my-qna")
@CrossOrigin("*")
public class MyQnaController {

    private final QnaWorkshopService qnaWorkshopService;
    private final QnaAdminService qnaAdminService;

    @DeleteMapping("/delete")
    public int deleteMyQna(
            @RequestParam String qnaType,
            @RequestParam(required = false) Integer qnaId,
            @RequestParam(required = false) Integer qnaAdminId
    ) {
        int result = 0;

        if ("공방".equals(qnaType) && qnaId != null) {
            result = qnaWorkshopService.deleteQna(qnaId);
        } else if ("관리자".equals(qnaType) && qnaAdminId != null) {
            result = qnaAdminService.deleteQnaToAdmin(qnaAdminId);
        }

        return result;
    }
    @PostMapping("/insert-qna")
    public int insertQnaToAdmin(@RequestBody QnaAdmin qnaAdmin) {
        return qnaAdminService.insertQnaToAdmin(qnaAdmin);
    }

    @PutMapping("/update-qna")
    public int updateAdminQna(@RequestBody QnaAdmin qnaAdmin) {
        return qnaAdminService.updateQnaToAdmin(qnaAdmin);
    }

}
