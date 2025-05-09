package com.example.rideshare.service;

import com.example.rideshare.dto.RideRequestDto;
import com.example.rideshare.dto.RideResponseDto;
import com.example.rideshare.model.Ride;
import com.example.rideshare.model.RideStatus;
import com.example.rideshare.model.User;
import com.example.rideshare.repository.RideRepository;
import com.example.rideshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideResponseDto bookRide(RideRequestDto request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Ride ride = Ride.builder()
                .user(user)
                .pickupLocation(request.getPickupLocation())
                .dropLocation(request.getDropLocation())
                .dateTime(LocalDateTime.now())
                .status(RideStatus.CONFIRMED) // Auto-confirm for simplicity
                .build();
        
        Ride savedRide = rideRepository.save(ride);
        return RideResponseDto.fromRide(savedRide);
    }

    public List<RideResponseDto> getUserRides(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<Ride> rides = rideRepository.findByUserOrderByDateTimeDesc(user);
        return rides.stream()
                .map(RideResponseDto::fromRide)
                .collect(Collectors.toList());
    }
}