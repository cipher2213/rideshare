package com.example.rideshare.controller;

import com.example.rideshare.dto.RideRequestDto;
import com.example.rideshare.dto.RideResponseDto;
import com.example.rideshare.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping("/book")
    public ResponseEntity<RideResponseDto> bookRide(
            @RequestBody RideRequestDto request,
            Authentication authentication) {
        return ResponseEntity.ok(rideService.bookRide(request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RideResponseDto>> getUserRides(Authentication authentication) {
        return ResponseEntity.ok(rideService.getUserRides(authentication.getName()));
    }
}