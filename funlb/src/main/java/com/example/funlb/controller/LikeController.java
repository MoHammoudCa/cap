package com.example.funlb.controller;

import com.example.funlb.entity.Like;
import com.example.funlb.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping
    public Like createLike(@RequestParam UUID userId, @RequestParam UUID eventId) {
        return likeService.createLike(userId, eventId);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteLike(
            @RequestParam UUID userId,
            @RequestParam UUID eventId) {
        likeService.deleteLike(userId, eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> checkLikeStatus(
            @RequestParam UUID userId,
            @RequestParam UUID eventId) {
        boolean isLiked = likeService.isLiked(userId, eventId);
        return ResponseEntity.ok(Collections.singletonMap("isLiked", isLiked));
    }

    @GetMapping("/count/{eventId}")
    public ResponseEntity<Map<String, Long>> getLikesCount(@PathVariable UUID eventId) {
        long count = likeService.getLikesCount(eventId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @GetMapping("/user-count/{userId}")
    public ResponseEntity<Map<String, Long>> getLikedEventsCountByUser(@PathVariable UUID userId) {
        long count = likeService.getLikedEventsCountByUser(userId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UUID>> getLikedEventsIds(@PathVariable UUID userId) {
        List<UUID> likedEventsIds = likeService.getLikedEventsIds(userId);
        return ResponseEntity.ok(likedEventsIds);
    }

    @GetMapping("/user-events/{userId}")
    public ResponseEntity<List<Like>> getLikedEvents(@PathVariable UUID userId) {
        List<Like> likedEvents = likeService.getLikedEventsByUser(userId);
        return ResponseEntity.ok(likedEvents);
    }
}