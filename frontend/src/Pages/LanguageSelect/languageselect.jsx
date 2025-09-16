import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import 'import "./languageselect.css";';

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedMode, setSelectedMode] = useState('voice-text');

  const languages = [
    { code: 'hi', name: 'हिंदी', display: 'Hindi' },
    { code: 'en', name: 'English', display: 'English' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', display: 'Punjabi' },
    { code: 'bn', name: 'বাংলা', display: 'Bengali' },
    { code: 'gu', name: 'ગુજરાતી', display: 'Gujarati' },
    { code: 'mr', name: 'मराठी', display: 'Marathi' }
  ];

  const modes = [
    {
      id: 'voice-text',
      name: t('languageSelect.modes.voiceText.name'),
      icon: '🔊📝',
      description: t('languageSelect.modes.voiceText.description'),
      suitable: t('languageSelect.modes.voiceText.suitable')
    },
    {
      id: 'voice-only',
      name: t('languageSelect.modes.voiceOnly.name'),
      icon: '🔊',
      description: t('languageSelect.modes.voiceOnly.description'),
      suitable: t('languageSelect.modes.voiceOnly.suitable')
    }
  ];

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
  };

  const handleContinue = () => {
    if (!selectedLanguage) {
      alert(t('languageSelect.pleaseSelectLanguage'));
      return;
    }

    // Store selection in localStorage
    const userPreferences = {
      language: selectedLanguage,
      mode: selectedMode,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('graminSwasthyaPrefs', JSON.stringify(userPreferences));
    
    // Navigate to login
    navigate('/login');
  };

  return (
    <MotionWrapper className="language-select-container" variant="container" stagger={true}>
      <div className="language-header">
        <h1>🏥 {t('languageSelect.appTitle')}</h1>
        <h2>Gramin Swasthya</h2>
        <p>{t('languageSelect.instruction')}</p>
      </div>

      {/* Language Selection */}
      <div className="selection-section">
        <h3>🌐 {t('languageSelect.selectLanguage')}</h3>
        <div className="language-grid">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`language-card ${selectedLanguage === lang.code ? 'selected' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <div className="language-name">{lang.name}</div>
              <div className="language-display">{lang.display}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mode Selection */}
      <div className="selection-section">
        <h3>🎯 {t('languageSelect.interactionMode')}</h3>
        <div className="mode-grid">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
              onClick={() => handleModeSelect(mode.id)}
            >
              <div className="mode-icon">{mode.icon}</div>
              <div className="mode-name">{mode.name}</div>
              <div className="mode-description">{mode.description}</div>
              <div className="mode-suitable">{mode.suitable}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Mode Info */}
      {selectedMode === 'voice-only' && (
        <div className="voice-info">
          <div className="info-card">
            <h4>🔊 {t('languageSelect.voiceOnlyFeatures.title')}</h4>
            <ul>
              <li>{t('languageSelect.voiceOnlyFeatures.audioInteractions')}</li>
              <li>{t('languageSelect.voiceOnlyFeatures.audioInstructions')}</li>
              <li>{t('languageSelect.voiceOnlyFeatures.voiceNavigation')}</li>
              <li>{t('languageSelect.voiceOnlyFeatures.perfectForIlliterate')}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="continue-section">
        <button 
          className={`continue-btn ${selectedLanguage ? 'enabled' : 'disabled'}`}
          onClick={handleContinue}
          disabled={!selectedLanguage}
        >
          {t('languageSelect.continue')}
        </button>
        
        {selectedLanguage && (
          <p className="selected-info">
            {t('languageSelect.selected')}: {languages.find(l => l.code === selectedLanguage)?.name} 
            {' '}({modes.find(m => m.id === selectedMode)?.name})
          </p>
        )}
      </div>
    </MotionWrapper>
  );
};

export default LanguageSelect;