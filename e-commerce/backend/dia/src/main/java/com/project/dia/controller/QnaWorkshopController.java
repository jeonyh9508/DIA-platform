package com.project.dia.controller;

import com.project.dia.model.dto.QnaWorkshopDTO;
import com.project.dia.model.vo.QnaWorkshop;
import com.project.dia.service.QnaWorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/qna")
@CrossOrigin("*")
public class QnaWorkshopController {

    private final QnaWorkshopService qnaWorkshopService;

    @PostMapping("/insert-qna")
    public int insertQna(@RequestBody QnaWorkshop workshop) {
        return qnaWorkshopService.insertQna(workshop);
    }

    @PostMapping("/register-qna")
    public QnaWorkshopDTO registerQna(@RequestBody QnaWorkshop workshop) {
        int result = qnaWorkshopService.insertQna(workshop);

        if (result == 1) {
            return qnaWorkshopService.selectOne(workshop.getQnaId());
        } else {
            return null;
        }
    }

    @GetMapping("/delete-qna")
    public int deleteQna(@RequestParam int qnaId) {
        return qnaWorkshopService.deleteQna(qnaId);
    }

}
