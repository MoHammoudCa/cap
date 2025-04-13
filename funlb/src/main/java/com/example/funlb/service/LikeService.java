package com.example.funlb.service;

import com.example.funlb.dto.LikeRequest;
import com.example.funlb.entity.Event;
import com.example.funlb.entity.Like;
import com.example.funlb.entity.User;
import com.example.funlb.repository.EventRepository;
import com.example.funlb.repository.LikeRepository;
import com.example.funlb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;

    public List<Like> getAllLikes() {
        return likeRepository.findAll();
    }

    public Like getLikeById(UUID id) {
        return likeRepository.findById(id).orElse(null);
    }

    public Like createLike(LikeRequest like, UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Event> eventOptional = eventRepository.findById(like.getEventId());
        User user = userOptional.get();
        Event event = eventOptional.get();
        Like l = like.getLike();
        l.setEvent(event);
        l.setUser(user);
        return likeRepository.save(l);
    }

    public void deleteLike(UUID id) {
        likeRepository.deleteById(id);
    }
}