package com.example.funlb.controller;

import com.example.funlb.dto.LikeRequest;
import com.example.funlb.entity.Event;
import com.example.funlb.entity.Like;
import com.example.funlb.entity.User;
import com.example.funlb.security.JwtUtil;
import com.example.funlb.service.LikeService;
import com.example.funlb.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reactions")
public class LikeController {

    @Autowired
    private LikeService likeService;
    @Autowired
    private UserService userService;


    private final JwtUtil jwtUtils;

    public LikeController(LikeService likeService, JwtUtil jwtUtils) {
        this.likeService = likeService;
        this.jwtUtils = jwtUtils;
    }

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
    private UUID getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtils.getUsernameFromToken(token);
        User user = userService.findByEmail(email);
        return user.getId();
    }

    @PostMapping
    public Like createLike(@RequestBody LikeRequest likeRequest, HttpServletRequest request ) {
        UUID userId = getUserIdFromRequest(request);
        return likeService.createLike(likeRequest, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLike(@PathVariable UUID id) {
        likeService.deleteLike(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public List<Like> getAllLikes(
            @RequestParam UUID eventId,
            @RequestParam UUID userId) {

        return likeService.getLikesByEventAndUser(eventId, userId);
    }
}