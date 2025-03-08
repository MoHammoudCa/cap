package com.example.funlb.repository;

import com.example.funlb.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, UUID> {
}