package com.example.funlb.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MessageRequest {
    private UUID senderId;
    private UUID recipientId;
    private String content;
    private String title;
}