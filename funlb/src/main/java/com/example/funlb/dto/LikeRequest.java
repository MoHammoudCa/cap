package com.example.funlb.dto;

import com.example.funlb.entity.Like;
import lombok.Data;

import java.util.UUID;

@Data
public class LikeRequest {
    private Like like;
    private UUID eventId;
}