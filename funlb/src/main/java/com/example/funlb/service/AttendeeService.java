package com.example.funlb.service;

import com.example.funlb.entity.Attendee;
import com.example.funlb.entity.Event;
import com.example.funlb.entity.Message;
import com.example.funlb.entity.User;
import com.example.funlb.repository.AttendeeRepository;
import com.example.funlb.repository.EventRepository;
import com.example.funlb.repository.MessageRepository;
import com.example.funlb.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AttendeeService {

    @Autowired
    private AttendeeRepository attendeeRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    private static final UUID EVENT_NOTIFIER_ID = UUID.fromString("12c93775-2273-4b80-8fa7-ac4e03deb396");

    @Transactional
    public Attendee registerAttendance(UUID userId, UUID eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        // Check if user is the organizer
        if (event.getOrganizer().getId().equals(userId)) {
            throw new IllegalArgumentException("Organizers cannot attend their own events");
        }


        // Check if already attending
        if (attendeeRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new IllegalArgumentException("User is already attending this event");
        }

        Attendee attendee = new Attendee();
        attendee.setUser(user);
        attendee.setEvent(event);

        Attendee savedAttendee = attendeeRepository.save(attendee);

        // Send confirmation message
        sendConfirmationMessage(userId, event);

        return savedAttendee;
    }

    private void sendConfirmationMessage(UUID userId, Event event) {
        User eventNotifier = userRepository.findById(EVENT_NOTIFIER_ID).orElseThrow();

        Message message = new Message();
        message.setSender(eventNotifier);
        message.setRecipient(userRepository.findById(userId).orElseThrow());
        message.setTitle("Attendance Confirmation: " + event.getTitle());
        message.setContent("You have successfully registered for the event '" +
                event.getTitle() + "' on " + event.getDate());
        message.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);
    }

    private void sendCancelationMessage(UUID userId, Event event) {
        User eventNotifier = userRepository.findById(EVENT_NOTIFIER_ID).orElseThrow();

        Message message = new Message();
        message.setSender(eventNotifier);
        message.setRecipient(userRepository.findById(userId).orElseThrow());
        message.setTitle("Attendance Cancellation: " + event.getTitle());
        message.setContent("You have successfully unregistered for the event '" +
                event.getTitle() + "' on " + event.getDate());
        message.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);
    }

    public int getAttendanceCount(UUID eventId) {
        return attendeeRepository.countByEventId(eventId);
    }

    public boolean isUserAttending(UUID userId, UUID eventId) {
        return attendeeRepository.existsByUserIdAndEventId(userId, eventId);
    }

    @Transactional
    public void cancelAttendance(UUID userId, UUID eventId) {
        attendeeRepository.deleteByUserIdAndEventId(userId, eventId);
        sendCancelationMessage(userId, eventRepository.findById(eventId).orElseThrow());
    }

    public List<Attendee> getEventAttendees(UUID eventId) {
        return attendeeRepository.findByEventId(eventId);
    }

    public List<Attendee> getUserAttendedEvents(UUID userId) {
        LocalDateTime now = LocalDateTime.now();
        return attendeeRepository.findByUserIdAndEventDateBefore(userId, now);
    }

    public long countUserAttendedEvents(UUID userId) {
        LocalDateTime now = LocalDateTime.now();
        return attendeeRepository.countByUserIdAndEventDateBefore(userId, now);
    }

    public List<Attendee> getUserUpcomingEvents(UUID userId) {
        LocalDateTime now = LocalDateTime.now();
        return attendeeRepository.findByUserIdAndEventDateAfter(userId, now);
    }
}