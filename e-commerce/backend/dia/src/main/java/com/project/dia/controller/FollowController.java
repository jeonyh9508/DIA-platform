package com.project.dia.controller;

import com.project.dia.model.vo.Follow;
import com.project.dia.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer/follow")
@CrossOrigin("*")
public class FollowController {

    private final FollowService followService;

    @PostMapping("/insert-follow")
    public int insertFollow(@RequestBody Follow follow) {
        return followService.insertFollow(follow);
    }

    @PostMapping("/update-follow")
    public int updateFollow(@RequestParam int followId, @RequestParam boolean active) {
        return followService.updateFollow(followId, active);
    }

    @PostMapping("/workshop-follow")
    public int workshopFollow(@RequestBody Follow follow) {
        Follow existing = followService.selectOne(follow);

        if (existing == null) {
            follow.setActive(true);
            return followService.insertFollow(follow);
        } else {
            int id = existing.getFollowId();
            boolean state = !existing.isActive();
            return followService.updateFollow(id, state);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Integer>> getFollowedWorkshops(@RequestParam int userId) {
        List<Integer> ids = followService.selectFollowedWorkshopIds(userId);
        return ResponseEntity.ok(ids);
    }

    @GetMapping("/tag")
    public List<Map<String, Object>> getAllWorkshopTags() {
        return followService.workshopTag();
    }



}
