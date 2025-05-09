package com.example.rideshare.dto;

import com.example.rideshare.model.Ride;
import com.example.rideshare.model.RideStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideResponseDto {
    private Long id;
    private String pickupLocation;
    private String dropLocation;
    private LocalDateTime dateTime;
    private RideStatus status;
    
    public static RideResponseDto fromRide(Ride ride) {
        return RideResponseDto.builder()
                .id(ride.getId())
                .pickupLocation(ride.getPickupLocation())
                .dropLocation(ride.getDropLocation())
                .dateTime(ride.getDateTime())
                .status(ride.getStatus())
                .build();
    }
}