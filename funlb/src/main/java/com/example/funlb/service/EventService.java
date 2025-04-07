package com.example.funlb.service;

import com.example.funlb.entity.Event;
import com.example.funlb.entity.User;
import com.example.funlb.repository.EventRepository;
import com.example.funlb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Event createEvent(Event event, UUID creatorId) {
        Optional<User> userOptional = userRepository.findById(creatorId);
        User creator = userOptional.get();
        event.setOrganizer(creator);
        return eventRepository.save(event);
    }

    public Event updateEvent(UUID id, Event eventDetails) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setLocation(eventDetails.getLocation());
            event.setCategories(eventDetails.getCategories());
            event.setDate(eventDetails.getDate());
            event.setImage(eventDetails.getImage());
            return eventRepository.save(event);
        }
        return null;
    }

    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getFilteredEvents(String searchQuery){
        if (searchQuery==null || searchQuery.isBlank()){
            return getAllEvents();
        }
        return getAllEvents().stream().filter(event -> event.getTitle()!= null &&  event.getTitle().toLowerCase().contains(searchQuery.toLowerCase())
                || event.getCategories()!= null &&  event.getCategories().toLowerCase().contains(searchQuery.toLowerCase())
                || event.getOrganizer()!= null && event.getOrganizer().getName().toLowerCase().contains(searchQuery.toLowerCase()))
                .toList();
    }

    public List<Event> getEventsByUser(UUID userId){
        return getAllEvents().stream().filter(event -> event.getOrganizer().getId().equals(userId)).toList();
    }
}