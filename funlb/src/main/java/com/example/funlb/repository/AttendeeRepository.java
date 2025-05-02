package com.example.funlb.repository;

import com.example.funlb.entity.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AttendeeRepository extends JpaRepository<Attendee, UUID> {
    boolean existsByUserIdAndEventId(UUID userId, UUID eventId);
    int countByEventId(UUID eventId);
    List<Attendee> findByEventId(UUID eventId);
    void deleteByUserIdAndEventId(UUID userId, UUID eventId);

    @Query("SELECT COUNT(a) FROM Attendee a WHERE a.event.id = :eventId")
    Integer getAttendanceCount(@Param("eventId") UUID eventId);
}