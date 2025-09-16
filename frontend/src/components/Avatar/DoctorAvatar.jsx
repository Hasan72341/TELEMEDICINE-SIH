import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedContent } from '../../utils/i18nUtils';
import './DoctorAvatar.css';

const DoctorAvatar = ({ doctor, size = 'medium' }) => {
  const { i18n } = useTranslation();
  
  // Generate initials from doctor name
  const getInitials = (name) => {
    if (!name) return 'DR';
    // If name is a multilingual object, get the localized version
    const localizedName = typeof name === 'object' 
      ? getLocalizedContent(name, i18n.language, 'Doctor')
      : name;
    return localizedName
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Generate background color based on specialty
  const getSpecialtyGradient = (specialization) => {
    const specialtyColors = {
      'cardiology': 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      'dermatology': 'linear-gradient(135deg, #4ecdc4, #44bd87)', 
      'pediatrics': 'linear-gradient(135deg, #a8e6cf, #74b9ff)',
      'orthopedics': 'linear-gradient(135deg, #fd79a8, #fdcb6e)',
      'gynecology': 'linear-gradient(135deg, #e17055, #fab1a0)',
      'general medicine': 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
      'general': 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
      'neurology': 'linear-gradient(135deg, #2d3436, #636e72)',
      'psychiatry': 'linear-gradient(135deg, #00b894, #00cec9)',
      'dentistry': 'linear-gradient(135deg, #0984e3, #74b9ff)',
      'ent': 'linear-gradient(135deg, #e84393, #fd79a8)',
      'ophthalmology': 'linear-gradient(135deg, #fdcb6e, #e17055)',
      'urology': 'linear-gradient(135deg, #00cec9, #55a3ff)',
      'oncology': 'linear-gradient(135deg, #636e72, #2d3436)',
      'radiology': 'linear-gradient(135deg, #a29bfe, #6c5ce7)'
    };

    // If specialization is a multilingual object, get the localized version
    const localizedSpecialization = typeof specialization === 'object' 
      ? getLocalizedContent(specialization, i18n.language, 'general')
      : specialization;
    
    const specialty = localizedSpecialization?.toLowerCase() || 'general';
    return specialtyColors[specialty] || specialtyColors['general'];
  };

  const initials = getInitials(doctor?.name);
  const gradient = getSpecialtyGradient(doctor?.specialization);
  const doctorName = typeof doctor?.name === 'object' 
    ? getLocalizedContent(doctor.name, i18n.language, 'Doctor')
    : doctor?.name || 'Doctor';

  return (
    <div 
      className={`doctor-avatar avatar-${size}`}
      style={{ background: gradient }}
      title={doctorName}
    >
      <span className="avatar-initials">{initials}</span>
    </div>
  );
};

export default DoctorAvatar;