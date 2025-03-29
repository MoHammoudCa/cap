package com.example.funlb.controller;

//import com.example.funlb.entity.Category;
import com.example.funlb.entity.Event;
//import com.example.funlb.service.CategoryService;
import com.example.funlb.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;
    @Autowired
//    private CategoryService categoryService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable UUID id) {
        Event event = eventService.getEventById(id);
        if (event != null) {
            return ResponseEntity.ok(event);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
//        Set<Category> categories = event.getCategories().stream()
//                .map(category -> categoryService.getCategoryById(category.getId()))
//                .collect(Collectors.toSet());
//        event.setCategories(categories);
        return eventService.createEvent(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable UUID id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        if (updatedEvent != null) {
//            Set<Category> categories = eventDetails.getCategories().stream()
//                    .map(category -> categoryService.getCategoryById(category.getId()))
//                    .collect(Collectors.toSet());
//            updatedEvent.setCategories(categories);
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
