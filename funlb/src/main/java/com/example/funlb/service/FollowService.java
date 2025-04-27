package com.example.funlb.service;

import com.example.funlb.entity.Follow;
import com.example.funlb.entity.User;
import com.example.funlb.repository.FollowRepository;
import com.example.funlb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Follow> getAllFollows() {
        return followRepository.findAll();
    }

    public Follow getFollowById(UUID id) {
        return followRepository.findById(id).orElse(null);
    }

    @Transactional
    public Follow createFollow(UUID followerId, UUID followedId) {
        // Check if follow relationship already exists
        if (followRepository.existsByFollowerIdAndFollowedId(followerId, followedId)) {
            throw new IllegalStateException("Already following this user");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new IllegalArgumentException("Followed user not found"));

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowed(followed);

        return followRepository.save(follow);
    }

    @Transactional
    public void deleteFollow(UUID followerId, UUID followedId) {
        followRepository.deleteByFollowerIdAndFollowedId(followerId, followedId);
    }

    public boolean isFollowing(UUID followerId, UUID followedId) {
        return followRepository.existsByFollowerIdAndFollowedId(followerId, followedId);
    }

    public long getFollowersCount(UUID userId) {
        return followRepository.countByFollowedId(userId);
    }
}