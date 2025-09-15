import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import FeatureCard from '../../components/Cards/FeatureCard';
import "./NewHome.css";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userAuth, setUserAuth] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);

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

  const mainFeatures = [
    {
      id: 'how-it-works',
      icon: '📋',
      title: t('home.features.howItWorks.title'),
      description: t('home.features.howItWorks.description'),
      path: '/how-it-works'
    },
    {
      id: 'ai-symptom-checker',
      icon: '🤖',
      title: t('home.features.aiSymptomChecker.title'),
      description: t('home.features.aiSymptomChecker.description'),
      path: '/ai-symptoms',
      featured: true
    },
    {
      id: 'book-consultation',
      icon: '👩‍⚕️',
      title: t('home.features.bookConsultation.title'),
      description: t('home.features.bookConsultation.description'),
      path: '/consultation'
    },
    {
      id: 'shop-medicines',
      icon: '💊',
      title: t('home.features.shopMedicines.title'),
      description: t('home.features.shopMedicines.description'),
      path: '/shop'
    }
  ];

  const quickActions = [
    {
      id: 'emergency',
      icon: '🚨',
      title: t('home.quickActionsItems.emergency.title'),
      description: t('home.quickActionsItems.emergency.description'),
      action: () => alert('Emergency services would be contacted in real app')
    },
    {
      id: 'my-health',
      icon: '📊',
      title: t('home.quickActionsItems.myHealth.title'),
      description: t('home.quickActionsItems.myHealth.description'),
      action: () => alert('Health records would be shown in real app')
    },
    {
      id: 'prescriptions',
      icon: '📝',
      title: t('home.quickActionsItems.prescriptions.title'),
      description: t('home.quickActionsItems.prescriptions.description'),
      action: () => alert('Prescriptions would be listed in real app')
    }
  ];

  const handleFeatureClick = (feature) => {
    if (feature.path) {
      navigate(feature.path);
    } else if (feature.action) {
      feature.action();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('graminSwasthyaAuth');
    localStorage.removeItem('graminSwasthyaPrefs');
    navigate('/language');
  };

  if (!userAuth) {
    return <div>Loading...</div>;
  }

  return (
    <MotionWrapper className="home-container" variant="container" stagger={true}>
      {/* Welcome Header */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1>🏥 {t('home.welcomeTitle')}</h1>
          <p className="welcome-subtitle">
            {t('home.welcomeSubtitle')}
          </p>
          
          {userPrefs && (
            <div className="user-info">
              <span className="language-badge">
                🌐 {userPrefs.mode === 'voice-only' ? '🔊 Voice Mode' : '📝 Voice + Text'}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout / लॉगआउट
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features-section">
        <h2>🎯 {t('home.mainServices')}</h2>
        <div className="features-grid">
          {mainFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${feature.featured ? 'featured' : ''}`}
              onClick={() => handleFeatureClick(feature)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">→</div>
              
              {feature.featured && (
                <div className="featured-badge">⭐ Popular</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2>⚡ {t('home.quickActions')}</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="quick-action-card"
              onClick={() => handleFeatureClick(action)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tip of the Day */}
      <section className="health-tip-section">
        <div className="health-tip-card">
          <h3>💡 {t('home.healthTipTitle')}</h3>
          <p>
            {t('home.healthTip')}
          </p>
          <p className="tip-hindi">
            {t('home.healthTipHindi')}
          </p>
        </div>
      </section>

      {/* Voice Mode Instructions */}
      {userPrefs?.mode === 'voice-only' && (
        <section className="voice-instructions">
          <div className="voice-card">
            <h3>🔊 {t('home.voiceCommandsTitle')}</h3>
            <ul>
              <li>"{t('home.voiceCommands.checkSymptoms')}"</li>
              <li>"{t('home.voiceCommands.bookDoctor')}"</li>
              <li>"{t('home.voiceCommands.buyMedicine')}"</li>
              <li>"{t('home.voiceCommands.emergencyHelp')}"</li>
            </ul>
          </div>
        </section>
      )}
    </MotionWrapper>
  );
};

export default Home;