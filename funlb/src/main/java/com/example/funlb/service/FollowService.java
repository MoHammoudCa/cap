package com.example.funlb.service;

import com.example.funlb.entity.Follow;
import com.example.funlb.repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    public List<Follow> getAllFollows() {
        return followRepository.findAll();
    }

    public Follow getFollowById(UUID id) {
        return followRepository.findById(id).orElse(null);
    }

    public Follow createFollow(Follow follow) {
        return followRepository.save(follow);
    }

    public void deleteFollow(UUID id) {
        followRepository.deleteById(id);
    }
}