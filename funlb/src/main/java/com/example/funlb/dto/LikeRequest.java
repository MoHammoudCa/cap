package com.example.funlb.dto;

import com.example.funlb.entity.Like;

import java.util.UUID;

public class LikeRequest {
    private Like like;
    private UUID eventId;

    // getters and setters
    public Like getLike() {
        return like;
    }

    public void setLike(Like like) {
        this.like = like;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }
}