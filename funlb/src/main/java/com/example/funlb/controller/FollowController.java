package com.example.funlb.controller;

import com.example.funlb.entity.Follow;
import com.example.funlb.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    @Autowired
    private FollowService followService;

    @GetMapping
    public List<Follow> getAllFollows() {
        return followService.getAllFollows();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Follow> getFollowById(@PathVariable UUID id) {
        Follow follow = followService.getFollowById(id);
        if (follow != null) {
            return ResponseEntity.ok(follow);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Follow createFollow(@RequestBody Follow follow) {
        return followService.createFollow(follow);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollow(@PathVariable UUID id) {
        followService.deleteFollow(id);
        return ResponseEntity.noContent().build();
    }
}