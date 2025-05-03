package com.example.funlb.service;

import com.example.funlb.entity.Message;
import com.example.funlb.repository.MessageRepository;
import com.example.funlb.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Message sendMessage(UUID senderId, UUID recipientId, String content, String title) {
        Message message = new Message();
        message.setSender(userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found")));
        message.setRecipient(userRepository.findById(recipientId)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found")));
        message.setContent(content);
        message.setTitle(title);
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        return messageRepository.save(message);
    }

    public List<Message> getMessagesForUser(UUID userId) {
        return messageRepository.findByRecipientIdOrderByTimestampDesc(userId);
    }

    public Long getUnreadCount(UUID userId) {
        return messageRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public Message markAsRead(UUID messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        return messageRepository.save(message);
    }
}
