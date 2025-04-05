package com.example.funlb.dto;

import java.util.UUID;

public class JwtResponse {
    private String token;
    private UUID id;
    private String name;
    private String email;
    private String role;
    private String profilePicture;

    public JwtResponse(String token, UUID id, String name, String email, String role, String profilePicture) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.profilePicture = profilePicture;
    }

    // getters and setters
}