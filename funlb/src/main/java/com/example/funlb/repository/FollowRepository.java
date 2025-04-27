package com.example.funlb.repository;

import com.example.funlb.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, UUID> {
    boolean existsByFollowerIdAndFollowedId(UUID followerId, UUID followedId);
    long countByFollowedId(UUID followedId);
    void deleteByFollowerIdAndFollowedId(UUID followerId, UUID followedId);
    List<Follow> findByFollowerId(UUID followerId);
}