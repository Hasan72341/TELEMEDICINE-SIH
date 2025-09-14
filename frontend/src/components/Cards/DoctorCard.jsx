import React from "react";

const DoctorCard = ({ doctor }) => {
  const isAvailable = doctor.availability?.includes("Now");
  return (
    <div className="doctor-card">
      <div className="doctor-image">
        <span className="doctor-avatar">{doctor.image}</span>
        <div className={`availability-badge ${isAvailable ? 'available' : 'busy'}`}>
          {isAvailable ? 'Available' : 'Busy'}
        </div>
      </div>

      <div className="doctor-info">
        <h3>{doctor.name}</h3>
        <p className="specialty">{doctor.specialty}</p>
        <p className="experience">{doctor.experience} experience</p>

        <div className="rating">
          <span className="stars">⭐⭐⭐⭐⭐</span>
          <span className="rating-number">{doctor.rating}</span>
        </div>

        <div className="availability">
          <span className="availability-text">{doctor.availability}</span>
        </div>

        <div className="doctor-actions">
          <div className="price">{doctor.price}/consultation</div>
          <button className="book-btn">Book Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
