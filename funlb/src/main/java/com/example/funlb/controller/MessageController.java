package com.example.funlb.controller;

import com.example.funlb.dto.MessageRequest;
import com.example.funlb.entity.Message;
import com.example.funlb.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public Message sendMessage(@RequestBody MessageRequest request) {
        return messageService.sendMessage(
                request.getSenderId(),
                request.getRecipientId(),
                request.getContent(),
                request.getTitle()
        );
    }

    @GetMapping("/inbox/{userId}")
    public List<Message> getInbox(@PathVariable UUID userId) {
        return messageService.getMessagesForUser(userId);
    }

    @GetMapping("/unread-count/{userId}")
    public Long getUnreadCount(@PathVariable UUID userId) {
        return messageService.getUnreadCount(userId);
    }

    @PutMapping("/{messageId}/read")
    public Message markAsRead(@PathVariable UUID messageId) {
        return messageService.markAsRead(messageId);
    }

}