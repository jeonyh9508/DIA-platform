package com.project.dia.controller.erp;

import com.project.dia.model.dto.AdminNoticeDTO;
import com.project.dia.model.vo.AdminNotice;
import com.project.dia.service.AdminNoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/erp-system")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminNoticeController {
    private final AdminNoticeService adminNoticeService;

    @GetMapping("/view")
    public List<AdminNoticeDTO> noticeAll(){
        return adminNoticeService.noticeAll();
    }

    @PostMapping("/write-notice")
    public int noticeAdd(@RequestBody AdminNotice adminNotice){
        return adminNoticeService.noticeAdd(adminNotice);
    }

    @GetMapping("/detail")
    public AdminNoticeDTO noticeOne(@RequestParam int adminNoticeId){
        return adminNoticeService.noticeOne(adminNoticeId);
    }

    @PostMapping("/notice-modi")
    public int noticeModi(@RequestBody AdminNotice adminNotice){
        return adminNoticeService.noticeModi(adminNotice);
    }

    @PostMapping("/notice-del")
    public int noticeDel (@RequestBody AdminNotice adminNotice){
        return adminNoticeService.noticeDel(adminNotice.getAdminNoticeId());
    }
}
