package com.example.funlb.repository;

import com.example.funlb.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, UUID> {
    boolean existsByUserIdAndEventId(UUID userId, UUID eventId);
    void deleteByUserIdAndEventId(UUID userId, UUID eventId);
    long countByEventId(UUID eventId);
    List<Like> findByUserId(UUID userId);
}