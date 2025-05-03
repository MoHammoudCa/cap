package com.example.funlb.repository;

import com.example.funlb.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByRecipientIdOrderByTimestampDesc(UUID recipientId);

    Long countByRecipientIdAndIsReadFalse(UUID recipientId);
}
