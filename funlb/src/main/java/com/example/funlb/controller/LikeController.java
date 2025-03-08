package com.example.funlb.controller;

import com.example.funlb.entity.Like;
import com.example.funlb.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @GetMapping
    public List<Like> getAllLikes() {
        return likeService.getAllLikes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Like> getLikeById(@PathVariable UUID id) {
        Like like = likeService.getLikeById(id);
        if (like != null) {
            return ResponseEntity.ok(like);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Like createLike(@RequestBody Like like) {
        return likeService.createLike(like);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLike(@PathVariable UUID id) {
        likeService.deleteLike(id);
        return ResponseEntity.noContent().build();
    }
}