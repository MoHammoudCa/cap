package com.example.funlb.service;

import com.example.funlb.entity.Event;
import com.example.funlb.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(UUID id, Event eventDetails) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setLocation(eventDetails.getLocation());
            event.setCategory(eventDetails.getCategory());
            event.setDate(eventDetails.getDate());
            event.setImage(eventDetails.getImage());
            return eventRepository.save(event);
        }
        return null;
    }

    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }
}