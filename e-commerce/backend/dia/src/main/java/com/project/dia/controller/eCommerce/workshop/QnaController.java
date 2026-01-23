package com.project.dia.controller.eCommerce.workshop;

import com.project.dia.model.dto.QnaWorkshopDTO;
import com.project.dia.model.vo.QnaAdmin;
import com.project.dia.model.vo.QnaWorkshop;
import com.project.dia.service.QnaAdminService;
import com.project.dia.service.QnaWorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/workshop/report")
public class QnaController {

    private final QnaWorkshopService qnaWorkshopService;
    private final QnaAdminService qnaAdminService;

    @PostMapping("/view")
    public List<QnaWorkshopDTO> qnaWorkshop(@RequestParam int workshopId){
        return qnaWorkshopService.qnaWorkshop(workshopId);
    }

    @PostMapping("/answer")
    public int qnaWsAnswer(@RequestBody QnaWorkshop workshop){
        return qnaWorkshopService.qnaWsAnswer(workshop);
    }

    @GetMapping("/qna-admin")
    public List<QnaAdmin> qnaAdminView(@RequestParam("ownerId") int userId){
        return qnaAdminService.qnaAdminView(userId);
    }

    @PostMapping("/delete")
    public int deleteQnaAdmin(@RequestBody QnaAdmin qnaAdmin) {
        return qnaAdminService.deleteQnaToAdmin(qnaAdmin.getQnaAdminId());
    }


}
