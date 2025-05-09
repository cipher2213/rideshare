package com.example.rideshare.repository;

import com.example.rideshare.model.Ride;
import com.example.rideshare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserOrderByDateTimeDesc(User user);
}