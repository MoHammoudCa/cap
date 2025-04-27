package com.example.funlb.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class FollowRequest {
    private UUID followerId;
    private UUID followedId;
}