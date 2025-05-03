package com.example.funlb.controller;


import com.example.funlb.entity.Event;
import com.example.funlb.entity.User;
import com.example.funlb.security.JwtUtil;
import com.example.funlb.service.EventService;
import com.example.funlb.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;
    @Autowired
    private UserService userService;
    private final JwtUtil jwtUtils;


    public EventController(EventService eventService, JwtUtil jwtUtils) {
        this.eventService = eventService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }


    @GetMapping("/user/{id}")
    public List<Event> getEventByOrganizerId(@PathVariable UUID id) {
        return eventService.getEventsByUser(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable UUID id) {
        Event event = eventService.getEventById(id);
        if (event != null) {
            return ResponseEntity.ok(event);
        }
        return ResponseEntity.notFound().build();
    }

    private UUID getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtils.getUsernameFromToken(token);
        User user = userService.findByEmail(email);
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, HttpServletRequest request) {
        UUID userId = getUserIdFromRequest(request);
        return ResponseEntity.ok(eventService.createEvent(event, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable UUID id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        if (updatedEvent != null) {
            return ResponseEntity.ok(updatedEvent);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
