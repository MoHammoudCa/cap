package com.example.funlb.controller;

import com.example.funlb.dto.FollowRequest;
import com.example.funlb.entity.Follow;
import com.example.funlb.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
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
    public Follow createFollow(@RequestBody FollowRequest request) {
        return followService.createFollow(request.getFollowerId(), request.getFollowedId());
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteFollow(
            @RequestParam UUID followerId,
            @RequestParam UUID followedId) {
        followService.deleteFollow(followerId, followedId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> checkFollowStatus(
            @RequestParam UUID followerId,
            @RequestParam UUID followedId) {
        boolean isFollowing = followService.isFollowing(followerId, followedId);
        return ResponseEntity.ok(Collections.singletonMap("isFollowing", isFollowing));
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Long>> getFollowersCount(@PathVariable UUID userId) {
        long count = followService.getFollowersCount(userId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }
}