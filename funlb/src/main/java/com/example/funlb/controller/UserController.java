package com.example.funlb.controller;

import com.example.funlb.dto.UserDTO;
import com.example.funlb.entity.User;
import com.example.funlb.repository.UserRepository;
import com.example.funlb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {
        UserDTO user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            userService.createUser(user);
            return ResponseEntity.ok("User created successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody User userDetails) {
//        User updatedUser = userService.updateUser(id, userDetails);
//        if (updatedUser != null) {
//            return ResponseEntity.ok("User updated successfully");
//        }
//        return ResponseEntity.notFound().build();
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable UUID id,
            @RequestBody User userDetails) {


        User currentUser = userRepository.findById(id).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.notFound().build();
        }

        currentUser.setName(userDetails.getName());
        currentUser.setEmail(userDetails.getEmail());
        currentUser.setRole(userDetails.getRole());
        currentUser.setProfilePicture(userDetails.getProfilePicture());

        User updatedUser = userRepository.save(currentUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}