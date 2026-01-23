package com.project.dia.controller.eCommerce.workshop;

import com.project.dia.model.dto.ProgramDTO;
import com.project.dia.model.dto.ScheduleDTO;
import com.project.dia.model.dto.WishDTO;
import com.project.dia.model.dto.WorkshopDTO;
import com.project.dia.model.vo.Program;
import com.project.dia.model.vo.ProgramImage;
import com.project.dia.service.ProgramService;
import com.project.dia.service.ScheduleService;
import com.project.dia.service.WishService;
import com.project.dia.service.WorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workshop/program")
@CrossOrigin(origins = "*")
public class ProgramController {

    private final ProgramService programService;
    private final ScheduleService scheduleService;
    private final WishService wishService;
    private final WorkshopService workshopService;

    @GetMapping("/ws-program")
    public List<WorkshopDTO> wsProgram(WorkshopDTO dto){
        return workshopService.selectMWP(dto);
    }

    @GetMapping("/select-one")
    public Program selectOne(@RequestParam("programId") int programId) {
        return programService.selectOne(programId);
    }

    @PostMapping("/add")
    public int programAdd(
            @RequestPart("program") Program program,       // JSON 데이터
            @RequestPart(value = "thumb", required = false) MultipartFile thumb,  // 썸네일
            @RequestPart(value = "multiImages", required = false) List<MultipartFile> multiImages) {  // 다중 이미지
        return programService.programAdd(program, thumb, multiImages);
    }

    @PostMapping("/modi")
    public void programModi(@RequestBody Program program) {
        programService.programModi(program);
    }

    @PostMapping("/active")
    public void programActive(@RequestBody Program program){
        programService.programActive(program);
    }

    @GetMapping("/schedule-list")
    public List<ScheduleDTO> programSchedule(@RequestParam("programId") int programId) {
        return scheduleService.selectAll(programId);
    }

    @PostMapping("/schedule-add")
    public void scheduleAdd(@RequestBody ScheduleDTO dto) {
        scheduleService.scheduleAdd(dto);
    }

    @PostMapping("/schedule-modi")
    public void scheduleModi(@RequestBody ScheduleDTO dto) {
        scheduleService.scheduleModi(dto);
    }

    @PostMapping("/schedule-del")
    public void scheduleDel(@RequestBody ScheduleDTO dto) {
        scheduleService.scheduleDel(dto.getScheduleId());
    }

    @GetMapping("/images")
    public List<ProgramImage> programImages(@RequestParam("programId") int programId){
        return programService.programImages(programId);
    }

    @GetMapping("/img-no")
    public int getImgNo(@RequestParam("programId") int programId){
        return programService.getImgNo(programId);
    }

    @GetMapping("/wish-list")
    public List<WishDTO> wishList (@RequestParam("programId") int programId) {
        return wishService.wishList(programId);
    }

    @PostMapping("/reject-reason")
    public ProgramDTO programReject(@RequestBody ProgramDTO dto){
        return programService.programReject(dto.getProgramId());
    }
}
