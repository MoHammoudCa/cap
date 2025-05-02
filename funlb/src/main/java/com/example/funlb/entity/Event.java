package com.example.funlb.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String title;
    private String description;
    private String location;
    private String categories;
    private Timestamp date;
    private String image;
    private int capacity;
    private int price;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    public boolean isAvailable() {
        return date != null && date.after(new Timestamp(System.currentTimeMillis()));
    }
}