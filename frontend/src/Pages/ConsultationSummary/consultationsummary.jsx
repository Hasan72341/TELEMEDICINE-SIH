import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import "./consultationsummary.css";

const ConsultationSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userPrefs, setUserPrefs] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);

  useEffect(() => {
    // Load user preferences
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    setUserPrefs(prefs);

    // Get summary from location state or localStorage
    const summaryData = location.state?.summary || 
      JSON.parse(localStorage.getItem('lastConsultationSummary') || '{}');
    
    if (summaryData) {
      setSummary(summaryData);
    } else {
      // Default summary if none found
      setSummary({
        doctorName: 'डॉ. राजेश शर्मा',
        duration: '12:34',
        notes: 'मरीज़ को हल्का बुखार और सिरदर्द की शिकायत है। सामान्य जांच में कोई गंभीर समस्या नहीं मिली।',
        prescription: 'पेरासिटामोल 500mg दिन में दो बार\nआराम करें और तरल पदार्थ लें',
        followUp: '3 दिन बाद फॉलो-अप',
        date: new Date().toLocaleDateString('hi-IN'),
        time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
      });
    }
  }, []);

  const downloadPrescription = () => {
    // Simulate prescription download
    const prescriptionData = {
      patientName: 'राहुल शर्मा',
      doctorName: summary?.doctorName,
      date: summary?.date,
      prescription: summary?.prescription,
      notes: summary?.notes,
      followUp: summary?.followUp
    };

    // Create a simple text file for download simulation
    const content = `
परामर्श रिपोर्ट
=================

मरीज़ का नाम: ${prescriptionData.patientName}
डॉक्टर का नाम: ${prescriptionData.doctorName}
दिनांक: ${prescriptionData.date}
समय: ${summary?.time}

दवाइयां:
${prescriptionData.prescription}

डॉक्टर के नोट्स:
${prescriptionData.notes}

फॉलो-अप:
${prescriptionData.followUp}

© ग्रामीण स्वास्थ्य - टेलीमेडिसिन प्लेटफॉर्म
    `;

    // Simulate download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prescription.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const shareReport = () => {
    // Simulate sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'परामर्श रिपोर्ट',
        text: `डॉ. ${summary?.doctorName} के साथ परामर्श पूरा हुआ। अवधि: ${summary?.duration}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `डॉ. ${summary?.doctorName} के साथ परामर्श पूरा हुआ। अवधि: ${summary?.duration}`;
      navigator.clipboard.writeText(shareText);
      alert('रिपोर्ट क्लिपबोर्ड में कॉपी हो गई!');
    }
  };

  const bookFollowUp = () => {
    navigate('/consultation', { state: { followUp: true, previousDoctor: summary?.doctorName } });
  };

  const buyMedicines = () => {
    navigate('/shop', { state: { prescription: summary?.prescription } });
  };

  if (!summary) {
    return (
      <MotionWrapper>
        <div className="consultation-summary-container loading">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>रिपोर्ट लोड हो रही है...</p>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper>
      <div className="consultation-summary-container">
        {/* Header */}
        <div className="summary-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/home')}
          >
            ← वापस
          </button>
          <h1>परामर्श रिपोर्ट</h1>
          <div className="header-actions">
            <button className="share-btn" onClick={shareReport}>
              📤 शेयर
            </button>
            <button className="download-btn" onClick={downloadPrescription}>
              📥 डाउनलोड
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-content">
          {/* Consultation Info */}
          <div className="summary-card consultation-info">
            <div className="card-header">
              <div className="success-icon">✅</div>
              <div className="consultation-status">
                <h2>परामर्श सफलतापूर्वक पूरा हुआ</h2>
                <p>आपका ऑनलाइन परामर्श सफलतापूर्वक संपन्न हुआ है</p>
              </div>
            </div>
            
            <div className="consultation-details">
              <div className="detail-item">
                <span className="detail-icon">👨‍⚕️</span>
                <div className="detail-content">
                  <span className="detail-label">डॉक्टर</span>
                  <span className="detail-value">{summary.doctorName}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">⏱️</span>
                <div className="detail-content">
                  <span className="detail-label">परामर्श की अवधि</span>
                  <span className="detail-value">{summary.duration} मिनट</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <div className="detail-content">
                  <span className="detail-label">दिनांक व समय</span>
                  <span className="detail-value">{summary.date} - {summary.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor's Notes */}
          <div className="summary-card doctor-notes">
            <div className="card-title">
              <span className="title-icon">📋</span>
              <h3>डॉक्टर के नोट्स</h3>
            </div>
            <div className="notes-content">
              <p>{summary.notes}</p>
            </div>
          </div>

          {/* Prescription */}
          <div className="summary-card prescription-card">
            <div className="card-title">
              <span className="title-icon">💊</span>
              <h3>दवाइयों की सूची</h3>
              <button 
                className="toggle-prescription"
                onClick={() => setShowPrescription(!showPrescription)}
              >
                {showPrescription ? '👁️ छुपाएं' : '👁️ देखें'}
              </button>
            </div>
            
            {showPrescription && (
              <div className="prescription-content">
                <div className="prescription-text">
                  {summary.prescription.split('\n').map((line, index) => (
                    <div key={index} className="prescription-line">
                      <span className="medicine-icon">💊</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                
                <div className="prescription-warning">
                  <span className="warning-icon">⚠️</span>
                  <p>डॉक्टर की सलाह के बिना दवाई की मात्रा न बदलें</p>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up */}
          <div className="summary-card followup-card">
            <div className="card-title">
              <span className="title-icon">🔄</span>
              <h3>फॉलो-अप की जानकारी</h3>
            </div>
            <div className="followup-content">
              <div className="followup-info">
                <span className="followup-icon">📅</span>
                <p>{summary.followUp}</p>
              </div>
              <button className="followup-btn" onClick={bookFollowUp}>
                फॉलो-अप बुक करें
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="summary-actions">
            <button className="action-btn primary" onClick={buyMedicines}>
              <span className="btn-icon">🛒</span>
              <div className="btn-content">
                <span className="btn-title">दवाइयां खरीदें</span>
                <span className="btn-subtitle">ऑनलाइन मेडिसिन स्टोर</span>
              </div>
            </button>
            
            <button className="action-btn secondary" onClick={bookFollowUp}>
              <span className="btn-icon">📅</span>
              <div className="btn-content">
                <span className="btn-title">फॉलो-अप बुक करें</span>
                <span className="btn-subtitle">अगली अपॉइंटमेंट</span>
              </div>
            </button>
            
            <button className="action-btn tertiary" onClick={() => navigate('/home')}>
              <span className="btn-icon">🏠</span>
              <div className="btn-content">
                <span className="btn-title">होम पर जाएं</span>
                <span className="btn-subtitle">मुख्य पेज</span>
              </div>
            </button>
          </div>

          {/* Health Tips */}
          <div className="summary-card health-tips">
            <div className="card-title">
              <span className="title-icon">💡</span>
              <h3>स्वास्थ्य सुझाव</h3>
            </div>
            <div className="tips-content">
              <div className="tip-item">
                <span className="tip-icon">💧</span>
                <p>पर्याप्त मात्रा में पानी पिएं (दिन में 8-10 गिलास)</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">😴</span>
                <p>पर्याप्त आराम करें (रात में 7-8 घंटे की नींद लें)</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🥗</span>
                <p>संतुलित आहार लें और जंक फूड से बचें</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🚶‍♂️</span>
                <p>नियमित हल्का व्यायाम करें</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="summary-card emergency-contact">
            <div className="card-title">
              <span className="title-icon">🚨</span>
              <h3>आपातकालीन संपर्क</h3>
            </div>
            <div className="emergency-content">
              <p>यदि आपकी हालत बिगड़े या कोई गंभीर समस्या हो तो तुरंत संपर्क करें:</p>
              <div className="emergency-numbers">
                <div className="emergency-item">
                  <span className="emergency-icon">🏥</span>
                  <div>
                    <strong>आपातकालीन हेल्पलाइन</strong>
                    <p>102 / 108</p>
                  </div>
                </div>
                <div className="emergency-item">
                  <span className="emergency-icon">👨‍⚕️</span>
                  <div>
                    <strong>डॉक्टर हेल्पलाइन</strong>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="summary-footer">
          <div className="footer-content">
            <p>© 2025 ग्रामीण स्वास्थ्य - टेलीमेडिसिन प्लेटफॉर्म</p>
            <p>आपका स्वास्थ्य, हमारी प्राथमिकता</p>
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default ConsultationSummary;