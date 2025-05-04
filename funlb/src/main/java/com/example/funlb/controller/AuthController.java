package com.example.funlb.controller;

import com.example.funlb.entity.User;
import com.example.funlb.repository.UserRepository;
import com.example.funlb.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtil jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtils.generateToken(userDetails.getUsername());

            // Get the full user details from repository
            User newUser = userRepository.findByEmail(user.getEmail());
            if (newUser == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Create response with all needed user data
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", newUser.getId());
            response.put("email", newUser.getEmail());
            response.put("role", newUser.getRole());
            response.put("name", newUser.getName());

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication failed");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already taken!");
        }

        // Create new user's account
        User newUser = User.builder()
                .email(user.getEmail())
                .password(encoder.encode(user.getPassword()))
                .name(user.getName())
                .role(user.getRole() != null ? user.getRole() : "USER") // Default role
                .build();

        userRepository.save(newUser);

        String token = jwtUtils.generateToken(newUser.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", newUser.getId());
        response.put("email", newUser.getEmail());
        response.put("role", newUser.getRole());
        response.put("name", newUser.getName());

        return ResponseEntity.ok(response);
    }
}