package com.dicom.backend.controller;
import com.dicom.backend.model.User;
import com.dicom.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/auth")
@CrossOrigin

public class AuthController {

    @Autowired
    private UserRepository userRepo;

    // ✅ SIGNUP
    @PostMapping("/signup")
    public Map<String, String> signup(@RequestBody User user) {

        Map<String, String> res = new HashMap<>();

        // 🔥 CHECK IF EMAIL EXISTS IN DB
        Optional<User> existing = userRepo.findByEmail(user.getEmail());

        if (existing.isPresent()) {
            res.put("error", "Email already exists");
            return res;
        }

        // 🔥 SAVE TO DATABASE
        userRepo.save(user);

        res.put("message", "User registered");
        return res;
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {

        Map<String, Object> res = new HashMap<>();

        // 🔥 CHECK FROM DATABASE
        Optional<User> existing = userRepo.findByEmail(user.getEmail());

        if (existing.isPresent() &&
                existing.get().getPassword().equals(user.getPassword())) {

            res.put("message", "Login success");
            res.put("role", existing.get().getRole());

        } else {
            res.put("error", "Invalid credentials");
        }

        return res;
    }
}