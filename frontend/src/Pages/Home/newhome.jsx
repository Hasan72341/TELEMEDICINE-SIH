import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getLocalizedContent } from '../../utils/i18nUtils';
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import FeatureCard from "../../components/Cards/FeatureCard";
import ServiceCard from "../../components/Cards/ServiceCard";
import homeData from "../../data/home.json";
import "./newhome.css";

const NewHome = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Use data from home.json
  const features = homeData.features || [];
  const services = homeData.services || [];

  // Debug logging
  console.log('Features:', features);
  console.log('Medicine feature:', features.find(f => f.id === 'medicine'));
  console.log('Current language:', i18n.language);

  const quickActions = [
    {
      id: "emergency",
      icon: "🚨",
      title: t('home.quickActions.emergency', 'Emergency'),
      description: t('home.quickActions.emergencyDesc', 'Connect to emergency services'),
      action: () => handleEmergency(),
      variant: "emergency"
    },
    {
      id: "health-records",
      icon: "📊",
      title: t('home.quickActions.healthRecords', 'My Health'),
      description: t('home.quickActions.healthRecordsDesc', 'View your health records'),
      action: () => handleHealthRecords(),
      variant: "primary"
    },
    {
      id: "prescriptions",
      icon: "📝",
      title: t('home.quickActions.prescriptions', 'Prescriptions'),
      description: t('home.quickActions.prescriptionsDesc', 'View past prescriptions'),
      action: () => handlePrescriptions(),
      variant: "secondary"
    }
  ];

  const handleEmergency = () => {
    // Emergency action - connect to emergency services
    const emergencyNumber = "108"; // National emergency helpline
    const confirmCall = window.confirm(
      `🚨 Emergency Alert!\n\nYou are about to call ${emergencyNumber} (National Emergency Helpline).\n\nThis will connect you to:\n• Ambulance Services\n• Medical Emergency Response\n• Fire Department\n• Police\n\nClick OK to proceed with the emergency call.`
    );
    
    if (confirmCall) {
      // In a real app, this would initiate an emergency call or connect to services
      window.open(`tel:${emergencyNumber}`, '_self');
      
      // Also show emergency information
      setTimeout(() => {
        alert(`📞 Calling ${emergencyNumber}...\n\n⚡ Quick Emergency Tips:\n• Stay calm and speak clearly\n• Provide your exact location\n• Describe the emergency situation\n• Follow dispatcher instructions\n\n🏥 Your location and medical info will be shared for faster response.`);
      }, 500);
    }
  };

  const handleHealthRecords = () => {
    // Navigate to dedicated health records page
    navigate('/health-records');
  };

  const handlePrescriptions = () => {
    // Initialize dummy prescriptions if they don't exist
    const hasPrescriptions = localStorage.getItem('userPrescriptions');
    
    if (!hasPrescriptions) {
      // Create dummy prescriptions
      const dummyPrescriptions = [
        {
          id: "RX001",
          date: "2024-09-10",
          doctor: "Dr. Rajesh Sharma",
          specialty: "Endocrinologist",
          medicines: [
            { name: "Metformin 500mg", dosage: "Twice daily after meals", duration: "30 days", remaining: 15 },
            { name: "Lisinopril 10mg", dosage: "Once daily morning", duration: "30 days", remaining: 20 },
            { name: "Vitamin D3", dosage: "Once weekly", duration: "12 weeks", remaining: 8 }
          ],
          instructions: "Follow prescribed dosage, regular monitoring required",
          diagnosis: "Type 2 Diabetes, Hypertension"
        },
        {
          id: "RX002",
          date: "2024-08-25",
          doctor: "Dr. Priya Gupta",
          specialty: "General Physician",
          medicines: [
            { name: "Amoxicillin 500mg", dosage: "Three times daily", duration: "7 days", remaining: 0 },
            { name: "Paracetamol 650mg", dosage: "As needed for fever", duration: "5 days", remaining: 3 }
          ],
          instructions: "Complete antibiotic course, rest and hydration",
          diagnosis: "Bacterial Infection"
        }
      ];
      
      localStorage.setItem('userPrescriptions', JSON.stringify(dummyPrescriptions));
    }
    
    // Show beautiful prescription modal
    showPrescriptionModal();
  };

  const showPrescriptionModal = () => {
    const prescriptions = JSON.parse(localStorage.getItem('userPrescriptions'));
    const latestRx = prescriptions[0];
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease-out;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 20px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.5);
      position: relative;
      animation: slideUp 0.3s ease-out;
    `;
    
    modalContent.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #e2e8f0;">
        <div>
          <h2 style="margin: 0; color: #1a202c; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
            📋 <span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">My Prescriptions</span>
          </h2>
          <p style="margin: 0.5rem 0 0 0; color: #64748b; font-size: 0.9rem;">Latest prescription details</p>
        </div>
        <button onclick="this.closest('.modal-overlay').remove()" style="
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #dc2626;
          border-radius: 12px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.2s ease;
        " onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'">✕</button>
      </div>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; color: white;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; font-size: 1.2rem; font-weight: 600;">📝 ${latestRx.id}</h3>
          <span style="background: rgba(255, 255, 255, 0.2); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500;">${latestRx.date}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span style="font-size: 1.1rem;">👨‍⚕️</span>
          <div>
            <div style="font-weight: 600; font-size: 1rem;">${latestRx.doctor}</div>
            <div style="font-size: 0.85rem; opacity: 0.9;">${latestRx.specialty}</div>
          </div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.15); padding: 0.8rem; border-radius: 10px; margin-top: 1rem;">
          <div style="font-size: 0.9rem; font-weight: 500; margin-bottom: 0.3rem;">🏥 Diagnosis:</div>
          <div style="font-size: 1rem;">${latestRx.diagnosis}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #1a202c; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
          💊 Medications (${latestRx.medicines.length})
        </h4>
        <div style="display: grid; gap: 0.8rem;">
          ${latestRx.medicines.map(med => `
            <div style="
              background: ${med.remaining <= 5 ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)'};
              border: 1px solid ${med.remaining <= 5 ? '#fecaca' : '#bae6fd'};
              border-radius: 12px;
              padding: 1rem;
              transition: all 0.2s ease;
            ">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: #1a202c; font-weight: 600; font-size: 0.95rem;">${med.name}</span>
                <span style="
                  background: ${med.remaining <= 5 ? '#dc2626' : med.remaining <= 10 ? '#f59e0b' : '#059669'};
                  color: white;
                  padding: 0.2rem 0.6rem;
                  border-radius: 12px;
                  font-size: 0.75rem;
                  font-weight: 600;
                ">${med.remaining} left</span>
              </div>
              <div style="color: #64748b; font-size: 0.85rem; line-height: 1.4;">
                <div style="margin-bottom: 0.2rem;"><strong>Dosage:</strong> ${med.dosage}</div>
                <div><strong>Duration:</strong> ${med.duration}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #bae6fd; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
        <h4 style="color: #1a202c; margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
          📋 Instructions
        </h4>
        <p style="color: #475569; margin: 0; line-height: 1.5; font-size: 0.9rem;">${latestRx.instructions}</p>
      </div>
      
      <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
        <button onclick="alert('📱 Prescription management will open full dashboard with all ${prescriptions.length} prescriptions')" style="
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          min-width: 120px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
          📊 View All (${prescriptions.length})
        </button>
        <button onclick="alert('🔄 Reorder reminders set for low stock medicines')" style="
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          min-width: 120px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(245, 158, 11, 0.4)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
          🔄 Reorder
        </button>
      </div>
      
      <div style="text-align: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 0.8rem; margin: 0;">
          💡 <strong>Tip:</strong> Set medication reminders for better health management
        </p>
      </div>
    `;
    
    modalOverlay.className = 'modal-overlay';
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
    
    // Close modal with Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        modalOverlay.remove();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  };

  return (
    <MotionWrapper className="home-container" variant="container" stagger={true}>
      <section className="hero-section">
        <div className="hero-content">
          <h1>{getLocalizedContent(homeData.hero?.title, i18n.language, 'Welcome to Gramin Swasthya')}</h1>
          <p>{getLocalizedContent(homeData.hero?.subtitle, i18n.language, 'Quality healthcare from the comfort of your home - Rural India\'s Premier Telemedicine Platform')}</p>
          <button className="cta-button cta-primary" onClick={() => navigate('/consultation')}>
            {getLocalizedContent(homeData.hero?.cta, i18n.language, 'Consult Doctor Now')}
          </button>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">🏥</div>
        </div>
      </section>

      <section className="quick-actions-section">
        <div className="section-header">
          <h2>⚡ {t('home.quickActions.title', 'Quick Actions')}</h2>
          <p>{t('home.quickActions.subtitle', 'Fast access to essential health services')}</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className={`quick-action-card ${action.variant}`}
              onClick={action.action}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2>{t('home.features.title', 'Why Choose Gramin Swasthya?')}</h2>
        <div className="features-grid">
          {features.map((f) => (
            <FeatureCard
              key={f.id}
              icon={f.icon}
              title={getLocalizedContent(f.title, i18n.language, f.title?.en || 'Feature')}
              description={getLocalizedContent(f.description, i18n.language, f.description?.en || 'Description')}
              cta={getLocalizedContent(f.cta, i18n.language, f.cta?.en || t('common.learnMore', 'Learn More'))}
              variant={f.variant || f.id}
            />
          ))}
        </div>
      </section>

      <section className="medicine-shop-section" style={{display: 'block', visibility: 'visible', opacity: 1, minHeight: '500px', backgroundColor: 'rgba(255, 152, 0, 0.2)'}}>
        <div className="section-header">
          <h2 style={{color: '#000', fontSize: '2.5rem', fontWeight: '900'}}>💊 {t('home.medicineShop.title', 'Medicine Shop')}</h2>
          <p style={{color: '#1a1a1a', fontSize: '1.3rem', fontWeight: '600'}}>{t('home.medicineShop.subtitle', 'Order medicines online with home delivery')}</p>
        </div>
        <div className="medicine-shop-card">
          <div className="medicine-shop-content">
            <div className="medicine-shop-icon" style={{fontSize: '4rem', marginBottom: '1.5rem'}}>🏪</div>
            <h3 style={{color: '#000', fontSize: '2rem', fontWeight: '800'}}>{getLocalizedContent(features.find(f => f.id === 'medicine')?.title, i18n.language, 'Medicine Delivery')}</h3>
            <p style={{color: '#1a1a1a', fontSize: '1.2rem', fontWeight: '600'}}>{getLocalizedContent(features.find(f => f.id === 'medicine')?.description, i18n.language, 'Get medicines from Jan Aushadhi and local pharmacies delivered home')}</p>
            <div className="medicine-features" style={{display: 'grid', gap: '1.5rem', margin: '2rem 0'}}>
              <div className="medicine-feature" style={{display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255, 255, 255, 0.3)', padding: '1rem 1.5rem', borderRadius: '15px'}}>
                <span className="feature-icon" style={{fontSize: '1.5rem'}}>🚚</span>
                <span style={{color: '#1a1a1a', fontWeight: '600'}}>{t('home.medicineShop.freeDelivery', 'Free Home Delivery')}</span>
              </div>
              <div className="medicine-feature" style={{display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255, 255, 255, 0.3)', padding: '1rem 1.5rem', borderRadius: '15px'}}>
                <span className="feature-icon" style={{fontSize: '1.5rem'}}>📋</span>
                <span style={{color: '#1a1a1a', fontWeight: '600'}}>{t('home.medicineShop.prescription', 'Prescription Verification')}</span>
              </div>
              <div className="medicine-feature" style={{display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255, 255, 255, 0.3)', padding: '1rem 1.5rem', borderRadius: '15px'}}>
                <span className="feature-icon" style={{fontSize: '1.5rem'}}>💰</span>
                <span style={{color: '#1a1a1a', fontWeight: '600'}}>{t('home.medicineShop.bestPrice', 'Best Prices')}</span>
              </div>
              <div className="medicine-feature" style={{display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255, 255, 255, 0.3)', padding: '1rem 1.5rem', borderRadius: '15px'}}>
                <span className="feature-icon" style={{fontSize: '1.5rem'}}>🏥</span>
                <span style={{color: '#1a1a1a', fontWeight: '600'}}>{t('home.medicineShop.janAushadhi', 'Jan Aushadhi Partner')}</span>
              </div>
            </div>
            <button 
              className="medicine-shop-btn"
              onClick={() => navigate('/shop')}
              style={{
                background: 'linear-gradient(135deg, #ff6f00, #e65100)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 3rem',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '1rem',
                minWidth: '250px'
              }}
            >
              {t('home.medicineShop.shopNow', 'Shop Medicines Now')} 🛒
            </button>
          </div>
        </div>
      </section>

      <section className="services-section">
        <h2>{t('home.services.title', 'Our Services')}</h2>
        <div className="services-grid">
          {services.map((s) => (
            <ServiceCard 
              key={s.id} 
              title={getLocalizedContent(s.title, i18n.language, s.title?.en || t('common.service', 'Service'))} 
              description={getLocalizedContent(s.description, i18n.language, s.description?.en || t('common.serviceDescription', 'Service description'))} 
            />
          ))}
        </div>
      </section>
    </MotionWrapper>
  );
};

export default NewHome;
