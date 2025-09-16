import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedContent } from '../../utils/i18nUtils';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import DoctorAvatar from '../../components/Avatar/DoctorAvatar';
import doctorsData from '../../data/doctors.json';
import slotsData from '../../data/slots.json';
import "./consultation.css";

// Debug data loading
console.log('Doctors data loaded:', doctorsData);
console.log('Slots data loaded:', slotsData);

const Consultation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState('category'); // category, doctor, slot, confirmation
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [userAuth, setUserAuth] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preSelectedDoctor, setPreSelectedDoctor] = useState(null);

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('graminSwasthyaAuth');
    const prefs = localStorage.getItem('graminSwasthyaPrefs');
    
    if (!auth) {
      // For demo purposes, create a temporary auth if coming from doctor selection
      if (location.state?.selectedDoctor) {
        const tempAuth = {
          aadhar: 'demo-user',
          name: 'Demo User',
          phone: '9999999999'
        };
        setUserAuth(tempAuth);
      } else {
        navigate('/language');
        return;
      }
    } else {
      setUserAuth(JSON.parse(auth));
    }
    
    if (prefs) {
      setUserPrefs(JSON.parse(prefs));
    }

    // Check if a doctor was pre-selected from the doctors page
    if (location.state?.selectedDoctor) {
      const doctor = location.state.selectedDoctor;
      
      // Validate doctor data
      if (doctor && doctor.id && doctor.name && doctor.specialization) {
        setPreSelectedDoctor(doctor);
        setSelectedDoctor(doctor);
        const specialization = getLocalizedContent(doctor.specialization, i18n.language, doctor.specialization);
        setSelectedCategory(specialization.toLowerCase().replace(/\s+/g, '-'));
        setCurrentStep('slot');
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
      } else {
        console.error('Invalid doctor data received:', doctor);
        // Fallback to category selection if doctor data is invalid
        setCurrentStep('category');
      }
    }
  }, [navigate, location.state]);

  // Use categories from doctors.json
  const categories = doctorsData.categories;

  const filteredDoctors = selectedCategory 
    ? (doctorsData?.doctors || []).filter(doctor => 
        doctor.categories && doctor.categories.includes(selectedCategory)
      )
    : [];

  // Get all available slots from the slots data structure
  const getAllSlots = () => {
    if (!slotsData?.timeSlots) return [];
    return slotsData.timeSlots.flatMap(dateSlot => 
      dateSlot.slots.map(slot => ({
        ...slot,
        date: dateSlot.date
      }))
    );
  };

  const availableSlots = selectedDoctor && selectedDate
    ? getAllSlots().filter(slot => 
        slot.doctorId === selectedDoctor.id && 
        slot.date === selectedDate && 
        slot.available
      )
    : [];

  // Generate mock slots if none exist for the selected doctor
  const generateMockSlots = (doctorId, date) => {
    if (!doctorId || !date) return [];
    
    const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
    return times.map((time, index) => ({
      id: `mock-${doctorId}-${date}-${index}`,
      doctorId: doctorId,
      date: date,
      time: time,
      available: true,
      mock: true // Flag to identify mock slots
    }));
  };

  const finalAvailableSlots = selectedDoctor && selectedDate
    ? (availableSlots.length > 0 
        ? availableSlots 
        : generateMockSlots(selectedDoctor.id, selectedDate))
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

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    if (!selectedDoctor) {
      alert('Something went wrong. Please go back and select a doctor.');
      return;
    }

    setIsLoading(true);
    
    // Simulate booking process with proper error handling
    setTimeout(() => {
      try {
        // Store booking in localStorage (in real app, this would be saved to database)
        const booking = {
          id: Date.now(),
          doctorId: selectedDoctor.id,
          doctorName: getLocalizedContent(selectedDoctor.name, i18n.language, selectedDoctor.name),
          doctorSpecialization: getLocalizedContent(selectedDoctor.specialization, i18n.language, selectedDoctor.specialization),
          category: selectedCategory || getLocalizedContent(selectedDoctor.specialization, i18n.language, selectedDoctor.specialization),
          date: selectedDate,
          time: selectedSlot.time,
          patientAadhar: userAuth?.aadhar || 'guest',
          status: 'confirmed',
          consultationFee: selectedDoctor.consultationFee,
          bookedAt: new Date().toISOString(),
          source: preSelectedDoctor ? 'doctor-card' : 'category-flow'
        };
        
        const existingBookings = JSON.parse(localStorage.getItem('consultationBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('consultationBookings', JSON.stringify(existingBookings));
        
        // Show success feedback
        if (userPrefs?.mode === 'voice-only') {
          speakText(`Booking confirmed with Dr. ${getLocalizedContent(selectedDoctor.name, i18n.language, selectedDoctor.name)} on ${formatDate(selectedDate)} at ${selectedSlot.time}`);
        }
        
        setIsLoading(false);
        setCurrentStep('confirmation');
      } catch (error) {
        console.error('Booking failed:', error);
        setIsLoading(false);
        alert('Sorry, there was an error booking your appointment. Please try again.');
      }
    }, 1500);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && userPrefs?.mode === 'voice-only') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userPrefs?.language === 'hindi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (!userAuth) {
    return (
      <div className="consultation-container">
        <div className="loading-message">
          <h2>Loading consultation...</h2>
          <p>Please wait while we set up your appointment booking.</p>
        </div>
      </div>
    );
  }

  // Error boundary check for missing data
  if (!doctorsData?.doctors || !Array.isArray(doctorsData.doctors)) {
    return (
      <div className="consultation-container">
        <div className="error-message">
          <h2>⚠️ Service Temporarily Unavailable</h2>
          <p>We're having trouble loading doctor information. Please try again later.</p>
          <button onClick={() => navigate('/doctors')} className="back-btn">
            ← Back to Doctors
          </button>
        </div>
      </div>
    );
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
        {!preSelectedDoctor && (
          <div className={`step ${currentStep === 'category' ? 'active' : currentStep !== 'category' ? 'completed' : ''}`}>
            <span>1</span>
            <p>Category</p>
          </div>
        )}
        <div className={`step ${preSelectedDoctor ? 'completed' : (currentStep === 'doctor' ? 'active' : ['slot', 'confirmation'].includes(currentStep) ? 'completed' : '')}`}>
          <span>{preSelectedDoctor ? '1' : '2'}</span>
          <p>Doctor {preSelectedDoctor ? '✓' : ''}</p>
        </div>
        <div className={`step ${currentStep === 'slot' ? 'active' : currentStep === 'confirmation' ? 'completed' : ''}`}>
          <span>{preSelectedDoctor ? '2' : '3'}</span>
          <p>Schedule</p>
        </div>
        <div className={`step ${currentStep === 'confirmation' ? 'active' : ''}`}>
          <span>{preSelectedDoctor ? '3' : '4'}</span>
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
                <h3>{getLocalizedContent(category.name, i18n.language, category.name)}</h3>
                <p className="category-description">{getLocalizedContent(category.description, i18n.language, category.description)}</p>
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
            <h2>Select Doctor for {getLocalizedContent(categories.find(c => c.id === selectedCategory)?.name, i18n.language, 'Selected Category')}</h2>
          </div>
          
          <div className="doctors-grid">
            {filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                className="doctor-card"
                onClick={() => handleDoctorSelect(doctor)}
              >
                <div className="doctor-avatar-container">
                  <DoctorAvatar doctor={doctor} size="large" />
                  <div className="online-indicator"></div>
                </div>
                
                <div className="doctor-info">
                  <h3>{getLocalizedContent(doctor.name, i18n.language, doctor.name)}</h3>
                  <p className="doctor-qualification">{getLocalizedContent(doctor.qualification, i18n.language, doctor.qualification)}</p>
                  <p className="doctor-specialization">{getLocalizedContent(doctor.specialization, i18n.language, doctor.specialization)}</p>
                  <p className="doctor-experience">{getLocalizedContent(doctor.experience, i18n.language, doctor.experience)}</p>
                  
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
            {preSelectedDoctor ? (
              <button onClick={() => navigate('/doctors')} className="back-step-btn">
                ← Back to Doctors
              </button>
            ) : (
              <button onClick={() => setCurrentStep('doctor')} className="back-step-btn">
                ← Back to Doctors
              </button>
            )}
            <h2>Schedule with Dr. {getLocalizedContent(selectedDoctor?.name, i18n.language, selectedDoctor?.name)}</h2>
            {preSelectedDoctor && (
              <p className="pre-selected-info">You selected this doctor from the doctors page</p>
            )}
          </div>

          <div className="selected-doctor-summary">
            <DoctorAvatar doctor={selectedDoctor} size="medium" />
            <div>
              <h4>{getLocalizedContent(selectedDoctor?.name, i18n.language, selectedDoctor?.name)}</h4>
              <p>{getLocalizedContent(selectedDoctor?.specialization, i18n.language, selectedDoctor?.specialization)}</p>
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
                {finalAvailableSlots.map(slot => (
                  <button
                    key={slot.id}
                    className={`slot-btn ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              
              {finalAvailableSlots.length === 0 && (
                <p className="no-slots">No slots available for this date. Please select another date.</p>
              )}
              
              {preSelectedDoctor && finalAvailableSlots.length > 0 && (
                <p className="slots-note">
                  ✅ Available slots for Dr. {getLocalizedContent(selectedDoctor.name, i18n.language, selectedDoctor.name)} - Select your preferred time
                </p>
              )}
            </div>
          )}

          {selectedSlot && (
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-details">
                <p><strong>Doctor:</strong> {getLocalizedContent(selectedDoctor.name, i18n.language, selectedDoctor.name)}</p>
                <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                <p><strong>Time:</strong> {selectedSlot.time}</p>
                <p><strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee}</p>
              </div>
              
              <button 
                onClick={handleSlotBooking} 
                className={`book-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !selectedSlot}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Booking your appointment...
                  </>
                ) : (
                  <>
                    📅 Confirm Booking with Dr. {getLocalizedContent(selectedDoctor.name, i18n.language, selectedDoctor.name)}
                    <span className="booking-fee">₹{selectedDoctor.consultationFee}</span>
                  </>
                )}
              </button>
              
              {preSelectedDoctor && (
                <div className="booking-info">
                  <p>✅ You're booking directly with your selected doctor</p>
                  <p>🕒 Your appointment will be confirmed instantly</p>
                </div>
              )}
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
                <span>{getLocalizedContent(selectedDoctor?.name, i18n.language, selectedDoctor?.name)}</span>
              </div>
              <div className="detail-row">
                <span>Specialization:</span>
                <span>{getLocalizedContent(selectedDoctor?.specialization, i18n.language, selectedDoctor?.specialization)}</span>
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
            <button onClick={() => navigate('/doctors')} className="doctors-btn">
              👩‍⚕️ Browse More Doctors
            </button>
            <button 
              onClick={() => {
                // In a real app, this would open the video call interface
                alert(`Video consultation will be available 5 minutes before your appointment time (${selectedSlot?.time}). You'll receive a notification.`);
              }} 
              className="join-btn"
            >
              📹 About Video Call
            </button>
          </div>
          
          {preSelectedDoctor && (
            <div className="booking-source">
              <p>✨ Thank you for booking directly from our doctors page!</p>
            </div>
          )}

          {userPrefs?.mode === 'voice-only' && (
            <button 
              onClick={() => speakText(`Booking confirmed with Dr. ${getLocalizedContent(selectedDoctor?.name, i18n.language, selectedDoctor?.name)} on ${formatDate(selectedDate)} at ${selectedSlot?.time}`)}
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