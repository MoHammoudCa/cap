package com.example.funlb.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User recipient;

    private String title;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;
}