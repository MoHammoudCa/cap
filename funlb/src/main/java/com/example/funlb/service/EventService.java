package com.example.funlb.service;

import com.example.funlb.entity.Event;
import com.example.funlb.entity.Message;
import com.example.funlb.entity.User;
import com.example.funlb.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final FollowRepository followRepository;
    private final AttendeeRepository attendeeRepository;
    private static final UUID EVENT_NOTIFIER_ID = UUID.fromString("12c93775-2273-4b80-8fa7-ac4e03deb396");

    public EventService(EventRepository eventRepository,
                        UserRepository userRepository,
                        MessageRepository messageRepository,
                        FollowRepository followRepository,
                        AttendeeRepository attendeeRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.followRepository = followRepository;
        this.attendeeRepository = attendeeRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id).orElse(null);
    }

    @Transactional
    public Event createEvent(Event event, UUID creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("Creator not found"));
        event.setOrganizer(creator);
        Event savedEvent = eventRepository.save(event);

        notifyFollowersAboutNewEvent(creator, savedEvent);
        return savedEvent;
    }

    @Transactional
    public Event updateEvent(UUID id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setLocation(eventDetails.getLocation());
        event.setCategories(eventDetails.getCategories());
        event.setDate(eventDetails.getDate());
        event.setImage(eventDetails.getImage());
        event.setCapacity(eventDetails.getCapacity());
        event.setPrice(eventDetails.getPrice());

        Event updatedEvent = eventRepository.save(event);

        notifyEventParticipants(updatedEvent,
                "Event Updated: " + updatedEvent.getTitle(),
                "The event '" + updatedEvent.getTitle() + "' has been updated. Please check the new details.");

        return updatedEvent;
    }

    @Transactional
    public void deleteEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        notifyEventParticipants(event,
                "Event Canceled: " + event.getTitle(),
                "The event '" + event.getTitle() + "' has been canceled by the organizer.");

        eventRepository.delete(event);
    }

    public List<Event> getEventsByUser(UUID userId) {
        return eventRepository.findByOrganizerId(userId);
    }

    private void notifyFollowersAboutNewEvent(User organizer, Event event) {
        List<UUID> followerIds = followRepository.findByFollowedId(organizer.getId())
                .stream()
                .map(follow -> follow.getFollower().getId())
                .toList();

        User systemUser = userRepository.findById(EVENT_NOTIFIER_ID)
                .orElseThrow(() -> new IllegalStateException("System notifier user not found"));

        String title = "New Event by " + organizer.getName();
        String content = organizer.getName() + " has created a new event: " +
                event.getTitle() + " on " + event.getDate();

        createBulkMessages(systemUser, followerIds, title, content);
    }

    private void notifyEventParticipants(Event event, String title, String content) {
        User systemUser = userRepository.findById(EVENT_NOTIFIER_ID)
                .orElseThrow(() -> new IllegalStateException("System notifier user not found"));

        createNotificationMessage(systemUser, event.getOrganizer().getId(), title, content);

        List<UUID> attendeeIds = attendeeRepository.findByEventId(event.getId())
                .stream()
                .map(attendee -> attendee.getUser().getId())
                .toList();

        createBulkMessages(systemUser, attendeeIds, title, content);
    }

    private void createBulkMessages(User sender, List<UUID> recipientIds, String title, String content) {
        recipientIds.forEach(recipientId ->
                createNotificationMessage(sender, recipientId, title, content));
    }

    private void createNotificationMessage(User sender, UUID recipientId, String title, String content) {
        userRepository.findById(recipientId).ifPresent(recipient -> {
            Message message = new Message();
            message.setSender(sender);
            message.setRecipient(recipient);
            message.setTitle(title);
            message.setContent(content);
            message.setTimestamp(LocalDateTime.now());
            messageRepository.save(message);
        });
    }
}