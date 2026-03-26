package com.dicom.backend.controller;

import com.dicom.backend.model.User;
import com.dicom.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    // ✅ SIGNUP
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userRepo.save(user);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {

        User existing = userRepo.findByEmail(user.getEmail());

        Map<String, Object> response = new HashMap<>();

        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            response.put("token", "dummy-token");
            response.put("role", existing.getRole());
            response.put("username", existing.getUsername());
        } else {
            response.put("error", "Invalid credentials");
        }

        return response;
    }
}