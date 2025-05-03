package com.example.funlb.controller;

import com.example.funlb.entity.Attendee;
import com.example.funlb.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendees")
public class AttendeeController {

    @Autowired
    private AttendeeService attendeeService;

    @PostMapping
    public ResponseEntity<Attendee> registerAttendance(
            @RequestParam UUID userId,
            @RequestParam UUID eventId) {
        try {
            Attendee attendee = attendeeService.registerAttendance(userId, eventId);
            return ResponseEntity.ok(attendee);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/count/{eventId}")
    public ResponseEntity<Integer> getAttendanceCount(@PathVariable UUID eventId) {
        return ResponseEntity.ok(attendeeService.getAttendanceCount(eventId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> isUserAttending(
            @RequestParam UUID userId,
            @RequestParam UUID eventId) {
        return ResponseEntity.ok(attendeeService.isUserAttending(userId, eventId));
    }

    @DeleteMapping
    public ResponseEntity<Void> cancelAttendance(
            @RequestParam UUID userId,
            @RequestParam UUID eventId) {
        attendeeService.cancelAttendance(userId, eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Attendee>> getEventAttendees(@PathVariable UUID eventId) {
        return ResponseEntity.ok(attendeeService.getEventAttendees(eventId));
    }

    @GetMapping("/user/{userId}/ended")
    public ResponseEntity<List<Attendee>> getUserAttendedEvents(@PathVariable UUID userId) {
        return ResponseEntity.ok(attendeeService.getUserAttendedEvents(userId));
    }

    @GetMapping("/user/{userId}/ended/count")
    public ResponseEntity<Long> countUserAttendedEvents(@PathVariable UUID userId) {
        return ResponseEntity.ok(attendeeService.countUserAttendedEvents(userId));
    }

    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<Attendee>> getUserUpcomingEvents(@PathVariable UUID userId) {
        return ResponseEntity.ok(attendeeService.getUserUpcomingEvents(userId));
    }
}