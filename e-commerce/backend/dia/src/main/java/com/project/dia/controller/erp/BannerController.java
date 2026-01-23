package com.project.dia.controller.erp;

import com.project.dia.config.security.PrincipalDetails;
import com.project.dia.model.vo.ActionLog;
import com.project.dia.model.vo.Banner;
import com.project.dia.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/erp-system/banner")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;


    @GetMapping
    public List<Banner> getAll() {
        return bannerService.getAll();
    }

    @PostMapping
    public String addBanner(
            @RequestParam("title") String title,
            @RequestParam("link") String link,
            @RequestParam("active") boolean active,
            @RequestParam("sortOrder") int sortOrder,
            @RequestParam("adminId") int adminId,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
    
        String sharedFolderPath = "C:/dia-project/banner/";
        File folder = new File(sharedFolderPath);
        if (!folder.exists()) folder.mkdirs();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String savePath = sharedFolderPath + fileName;

        file.transferTo(new File(savePath));

        Banner banner = Banner.builder()
                .adminId(adminId)
                .title(title)
                .link(link)
                .active(active)
                .sortOrder(sortOrder)
                .image("/upload/banner/" + fileName) // 프론트 접근 URL
                .build();

        bannerService.addBanner(banner);

        return "success";
    }


    @PutMapping
    public String updateBanner(
            @ModelAttribute Banner banner,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws Exception {

        // 1) 기존 배너 조회 (기존 이미지 유지 위함)
        Banner origin = bannerService.getOne(banner.getBannerId());
        String imagePath = origin.getImage();

        // 2) 파일이 새로 업로드된 경우만 저장 처리
        if (file != null && !file.isEmpty()) {

            // 저장 경로 → addBanner와 동일하게 맞춰야 함
            String sharedFolderPath = "/dia-project/banner/";
            File folder = new File(sharedFolderPath);
            if (!folder.exists()) folder.mkdirs();

            // 파일명 통일
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String savePath = sharedFolderPath + fileName;

            // 공유 폴더에 저장
            file.transferTo(new File(savePath));

            // 프론트에서 접근하는 URL 형식
            imagePath = "/upload/banner/" + fileName;
        }

        // 3) 최종 이미지 경로 적용
        banner.setImage(imagePath);

        // 4) DB 업데이트
        bannerService.updateBanner(banner);
        return "success";
    }


    @DeleteMapping("/{bannerId}")
    public String deleteBanner(@PathVariable int bannerId) {
        bannerService.deleteBanner(bannerId);
        return "success";
    }

    @PutMapping("/order")
    public String updateOrder(@RequestParam int bannerId, @RequestParam int sortOrder) {
        bannerService.updateOrder(bannerId, sortOrder);
        return "success";
    }

    @PutMapping("/active")
    public int updateActive(
            @RequestParam int bannerId,
            @RequestParam boolean active
    ) {
        return bannerService.updateActive(bannerId, active);
    }



}

