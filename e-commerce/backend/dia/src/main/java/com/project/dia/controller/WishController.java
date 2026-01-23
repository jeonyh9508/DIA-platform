package com.project.dia.controller;

import com.project.dia.model.dto.WishDTO;
import com.project.dia.service.WishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/wish")
@CrossOrigin("*")
public class WishController {

    private final WishService wishService;

    @PostMapping("/insert-wish")
    public void insertWish(@RequestBody WishDTO wish) {
        wishService.insertWish(wish);
    }

    @PostMapping("/update-wish")
    public void updateWish(@RequestBody WishDTO wish) {
        wishService.updateWish(wish);
    }

    @PostMapping("/wish-program")
    public boolean wishProgram(@RequestBody WishDTO wish) {
        WishDTO existWish = wishService.selectOne(wish);

        if (existWish == null) {
            wishService.insertWish(wish);
            return true;
        } else {
            boolean newActive = !existWish.isActive();
            wish.setActive(newActive);
            wishService.updateWish(wish);
            return newActive; // 변경된 상태 반환
        }

    }


}
