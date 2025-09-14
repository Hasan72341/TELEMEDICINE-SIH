import React, { useState } from "react";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import DoctorCard from "../../components/Cards/DoctorCard";
import doctorsData from "../../data/doctors.json";
import "./doctors.css";

const Doctors = () => {
  const doctors = doctorsData.doctors;

  return (
    <MotionWrapper className="doctors-container" variant="container" stagger={true}>
      <div className="page-header">
        <h1 className="page-title">Our Expert Doctors</h1>
        <p className="page-subtitle">Connect with rural India's finest healthcare professionals from the comfort of your home</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Specialty:</label>
          <select>
            <option value="">All Specialties</option>
            <option value="general">General Medicine</option>
            <option value="cardiology">Cardiology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="dermatology">Dermatology</option>
            <option value="mental-health">Mental Health</option>
            <option value="orthopedics">Orthopedics</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Availability:</label>
          <select>
            <option value="">Any Time</option>
            <option value="now">Available Now</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort by:</label>
          <select>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      <div className="emergency-section">
        <div className="emergency-card">
          <h2>🚨 Emergency Consultation</h2>
          <p>Need immediate medical attention? Connect with our emergency doctors instantly.</p>
          <button className="emergency-btn">Get Emergency Help</button>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default Doctors;
