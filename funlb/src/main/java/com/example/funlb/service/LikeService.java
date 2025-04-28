package com.example.funlb.service;

import com.example.funlb.entity.Like;
import com.example.funlb.entity.Event;
import com.example.funlb.entity.User;
import com.example.funlb.repository.LikeRepository;
import com.example.funlb.repository.EventRepository;
import com.example.funlb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Transactional
    public Like createLike(UUID userId, UUID eventId) {
        if (likeRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new IllegalStateException("User already liked this event");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        Like like = new Like();
        like.setUser(user);
        like.setEvent(event);

        return likeRepository.save(like);
    }

    @Transactional
    public void deleteLike(UUID userId, UUID eventId) {
        likeRepository.deleteByUserIdAndEventId(userId, eventId);
    }

    public boolean isLiked(UUID userId, UUID eventId) {
        return likeRepository.existsByUserIdAndEventId(userId, eventId);
    }

    public long getLikesCount(UUID eventId) {
        return likeRepository.countByEventId(eventId);
    }

    public long getLikedEventsCountByUser(UUID userId) {
        return likeRepository.countByUserId(userId);
    }

    public List<UUID> getLikedEventsIds(UUID userId) {
        return likeRepository.findByUserId(userId).stream()
                .map(like -> like.getEvent().getId())
                .toList();
    }

    public List<Like> getLikedEventsByUser(UUID userId) {
        return likeRepository.findByUserId(userId);
    }
}