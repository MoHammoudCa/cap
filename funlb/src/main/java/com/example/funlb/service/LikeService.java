package com.example.funlb.service;

import com.example.funlb.entity.Like;
import com.example.funlb.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public List<Like> getAllLikes() {
        return likeRepository.findAll();
    }

    public Like getLikeById(UUID id) {
        return likeRepository.findById(id).orElse(null);
    }

    public Like createLike(Like like) {
        return likeRepository.save(like);
    }

    public void deleteLike(UUID id) {
        likeRepository.deleteById(id);
    }
}