import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocalizedContent, formatConsultationFee, getAvailabilityStatus } from "../../utils/i18nUtils";

const DoctorCard = ({ doctor }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Using actual doctor data from JSON
  const isAvailable = doctor.available;
  
  const handleBookConsultation = () => {
    navigate('/consultation', { state: { selectedDoctor: doctor } });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Save to localStorage or backend
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="stars">
        {"⭐".repeat(fullStars)}
        {hasHalfStar && "⭐"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };
  
  return (
    <div className="doctor-card enhanced">
      {/* Header with Avatar and Status */}
      <div className="doctor-header">
        <div className="doctor-avatar-section">
          <div className="doctor-avatar">
            <span className="avatar-emoji">{doctor.image}</span>
          </div>
          
          <div className={`availability-status ${isAvailable ? 'available' : 'busy'}`}>
            <div className="status-indicator"></div>
            <span className="status-text">
              {getAvailabilityStatus(isAvailable, i18n.language)}
            </span>
          </div>
        </div>

        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          title="Add to Favorites"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Basic Info using JSON data */}
      <div className="doctor-basic-info">
        <h3 className="doctor-name">{useLocalizedContent(doctor.name, doctor.name)}</h3>
        <div className="doctor-credentials">
          <p className="specialization">{useLocalizedContent(doctor.specialization, doctor.specialization)}</p>
          <p className="qualification">{useLocalizedContent(doctor.qualification, doctor.qualification)}</p>
        </div>
      </div>

      {/* Professional Details from JSON */}
      <div className="professional-details">
        <div className="detail-item">
          <span className="detail-icon">🎯</span>
          <span className="detail-text">{useLocalizedContent(doctor.experience, doctor.experience)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-icon">🌐</span>
          <span className="detail-text">{doctor.languages.join(', ')}</span>
        </div>
      </div>

      {/* Description */}
      <div className="doctor-description">
        <p>{useLocalizedContent(doctor.description, doctor.description)}</p>
      </div>

      {/* Rating using JSON data */}
      <div className="rating-section">
        <div className="rating">
          {renderStars(doctor.rating)}
          <span className="rating-number">{doctor.rating}</span>
          <span className="rating-text">({Math.floor(doctor.rating * 25)} reviews)</span>
        </div>
      </div>

      {/* Pricing and Actions using JSON data */}
      <div className="doctor-actions">
        <div className="pricing-info">
          <div className="consultation-fee">
            <span className="price">{formatConsultationFee(doctor.consultationFee, i18n.language)}</span>
            {doctor.consultationFee > 0 && (
              <span className="fee-label">/{t('doctors.card.consultation')}</span>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className={`book-btn ${!isAvailable ? 'disabled' : ''}`}
            onClick={handleBookConsultation}
            disabled={!isAvailable}
          >
            {isAvailable ? t('doctors.card.bookAppointment') : 'Currently Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
