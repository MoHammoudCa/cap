package com.example.funlb.repository;

import com.example.funlb.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
     List<Event> findByOrganizerId(UUID userI);
}