import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import doctorsData from '../../data/doctors.json';
import slotsData from '../../data/slots.json';
import "./Consultation.css";

const Consultation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('category'); // category, doctor, slot, confirmation
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [userAuth, setUserAuth] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('graminSwasthyaAuth');
    const prefs = localStorage.getItem('graminSwasthyaPrefs');
    
    if (!auth) {
      navigate('/language');
      return;
    }
    
    setUserAuth(JSON.parse(auth));
    if (prefs) {
      setUserPrefs(JSON.parse(prefs));
    }
  }, [navigate]);

  const categories = [
    {
      id: 'general',
      name: 'General Medicine',
      icon: '🩺',
      description: 'Common health issues, fever, cold, etc.',
      hindi: 'सामान्य चिकित्सा'
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      icon: '👶',
      description: 'Child health and development',
      hindi: 'बाल रोग विशेषज्ञ'
    },
    {
      id: 'gynecology',
      name: 'Gynecology',
      icon: '👩‍⚕️',
      description: 'Women\'s health and reproductive care',
      hindi: 'स्त्री रोग विशेषज्ञ'
    },
    {
      id: 'dermatology',
      name: 'Dermatology',
      icon: '🔬',
      description: 'Skin, hair, and nail conditions',
      hindi: 'त्वचा विशेषज्ञ'
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics',
      icon: '🦴',
      description: 'Bone, joint, and muscle problems',
      hindi: 'हड्डी रोग विशेषज्ञ'
    },
    {
      id: 'cardiology',
      name: 'Cardiology',
      icon: '❤️',
      description: 'Heart and cardiovascular health',
      hindi: 'हृदय रोग विशेषज्ञ'
    }
  ];

  const filteredDoctors = selectedCategory 
    ? doctorsData.doctors.filter(doctor => 
        doctor.categories && doctor.categories.includes(selectedCategory)
      )
    : [];

  const availableSlots = selectedDoctor && selectedDate
    ? slotsData.slots.filter(slot => 
        slot.doctorId === selectedDoctor.id && 
        slot.date === selectedDate && 
        slot.available
      )
    : [];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    setCurrentStep('doctor');
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep('slot');
  };

  const handleSlotBooking = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    setIsLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      // Update slot availability (in real app, this would be an API call)
      const updatedSlots = slotsData.slots.map(slot => 
        slot.id === selectedSlot.id 
          ? { ...slot, available: false, bookedBy: userAuth.aadhar }
          : slot
      );
      
      // Store booking in localStorage (in real app, this would be saved to database)
      const booking = {
        id: Date.now(),
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        category: selectedCategory,
        date: selectedDate,
        time: selectedSlot.time,
        patientAadhar: userAuth.aadhar,
        status: 'confirmed',
        consultationFee: selectedDoctor.consultationFee,
        bookedAt: new Date().toISOString()
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('consultationBookings', JSON.stringify(existingBookings));
      
      setIsLoading(false);
      setCurrentStep('confirmation');
    }, 2000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && userPrefs?.mode === 'voice-only') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userPrefs?.language === 'hindi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (!userAuth) {
    return <div>Loading...</div>;
  }

  return (
    <MotionWrapper className="consultation-container" variant="container">
      <div className="consultation-header">
        <button onClick={() => navigate('/home')} className="back-btn">
          ← Back to Home
        </button>
        <h1>👩‍⚕️ Book Consultation</h1>
        <p>Connect with certified doctors for video consultation</p>
      </div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className={`step ${currentStep === 'category' ? 'active' : currentStep !== 'category' ? 'completed' : ''}`}>
          <span>1</span>
          <p>Category</p>
        </div>
        <div className={`step ${currentStep === 'doctor' ? 'active' : ['slot', 'confirmation'].includes(currentStep) ? 'completed' : ''}`}>
          <span>2</span>
          <p>Doctor</p>
        </div>
        <div className={`step ${currentStep === 'slot' ? 'active' : currentStep === 'confirmation' ? 'completed' : ''}`}>
          <span>3</span>
          <p>Schedule</p>
        </div>
        <div className={`step ${currentStep === 'confirmation' ? 'active' : ''}`}>
          <span>4</span>
          <p>Confirm</p>
        </div>
      </div>

      {/* Category Selection */}
      {currentStep === 'category' && (
        <div className="category-section">
          <h2>Select Medical Category / चिकित्सा श्रेणी चुनें</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => handleCategorySelect(category)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p className="category-hindi">{category.hindi}</p>
                <p className="category-description">{category.description}</p>
                <div className="category-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Selection */}
      {currentStep === 'doctor' && (
        <div className="doctor-section">
          <div className="section-header">
            <button onClick={() => setCurrentStep('category')} className="back-step-btn">
              ← Back to Categories
            </button>
            <h2>Select Doctor for {categories.find(c => c.id === selectedCategory)?.name}</h2>
          </div>
          
          <div className="doctors-grid">
            {filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                className="doctor-card"
                onClick={() => handleDoctorSelect(doctor)}
              >
                <div className="doctor-avatar">
                  <img src={doctor.image || '/api/placeholder/80/80'} alt={doctor.name} />
                  <div className="online-indicator"></div>
                </div>
                
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="doctor-qualification">{doctor.qualification}</p>
                  <p className="doctor-specialization">{doctor.specialization}</p>
                  <p className="doctor-experience">{doctor.experience} years experience</p>
                  
                  <div className="doctor-details">
                    <div className="rating">
                      ⭐ {doctor.rating} ({doctor.reviews} reviews)
                    </div>
                    <div className="consultation-fee">
                      💰 ₹{doctor.consultationFee}
                    </div>
                  </div>
                  
                  <div className="doctor-languages">
                    <span>Languages: {doctor.languages.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slot Selection */}
      {currentStep === 'slot' && (
        <div className="slot-section">
          <div className="section-header">
            <button onClick={() => setCurrentStep('doctor')} className="back-step-btn">
              ← Back to Doctors
            </button>
            <h2>Schedule with Dr. {selectedDoctor?.name}</h2>
          </div>

          <div className="selected-doctor-summary">
            <img src={selectedDoctor?.image || '/api/placeholder/60/60'} alt={selectedDoctor?.name} />
            <div>
              <h4>{selectedDoctor?.name}</h4>
              <p>{selectedDoctor?.specialization}</p>
              <p>Consultation Fee: ₹{selectedDoctor?.consultationFee}</p>
            </div>
          </div>

          <div className="date-selection">
            <h3>Select Date / तारीख चुनें</h3>
            <div className="dates-grid">
              {getAvailableDates().map(date => (
                <button
                  key={date}
                  className={`date-btn ${selectedDate === date ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className="time-selection">
              <h3>Available Time Slots / उपलब्ध समय स्लॉट</h3>
              <div className="slots-grid">
                {availableSlots.map(slot => (
                  <button
                    key={slot.id}
                    className={`slot-btn ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              
              {availableSlots.length === 0 && (
                <p className="no-slots">No slots available for this date. Please select another date.</p>
              )}
            </div>
          )}

          {selectedSlot && (
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-details">
                <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                <p><strong>Time:</strong> {selectedSlot.time}</p>
                <p><strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee}</p>
              </div>
              
              <button 
                onClick={handleSlotBooking} 
                className="book-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Booking...
                  </>
                ) : (
                  '📅 Confirm Booking'
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation */}
      {currentStep === 'confirmation' && (
        <div className="confirmation-section">
          <div className="success-animation">
            <div className="success-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your consultation has been successfully booked</p>
          </div>

          <div className="booking-details">
            <h3>Booking Details</h3>
            <div className="detail-card">
              <div className="detail-row">
                <span>Doctor:</span>
                <span>{selectedDoctor?.name}</span>
              </div>
              <div className="detail-row">
                <span>Specialization:</span>
                <span>{selectedDoctor?.specialization}</span>
              </div>
              <div className="detail-row">
                <span>Date:</span>
                <span>{formatDate(selectedDate)}</span>
              </div>
              <div className="detail-row">
                <span>Time:</span>
                <span>{selectedSlot?.time}</span>
              </div>
              <div className="detail-row">
                <span>Consultation Fee:</span>
                <span>₹{selectedDoctor?.consultationFee}</span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>🔔 You'll receive a reminder 15 minutes before your appointment</li>
              <li>💻 Join the video consultation from your dashboard</li>
              <li>📝 Prepare any medical records or questions you may have</li>
              <li>💳 Payment will be processed after the consultation</li>
            </ul>
          </div>

          <div className="confirmation-actions">
            <button onClick={() => navigate('/home')} className="home-btn">
              🏠 Back to Home
            </button>
            <button 
              onClick={() => alert('Video call feature would open in real app')} 
              className="join-btn"
            >
              📹 Join Video Consultation (Demo)
            </button>
          </div>

          {userPrefs?.mode === 'voice-only' && (
            <button 
              onClick={() => speakText(`Booking confirmed with Dr. ${selectedDoctor?.name} on ${formatDate(selectedDate)} at ${selectedSlot?.time}`)}
              className="speak-confirmation-btn"
            >
              🔊 Hear Confirmation
            </button>
          )}
        </div>
      )}
    </MotionWrapper>
  );
};

export default Consultation;