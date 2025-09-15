import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [aadharNumber, setAadharNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userPrefs, setUserPrefs] = useState(null);

  useEffect(() => {
    // Load user preferences
    const prefs = localStorage.getItem('graminSwasthyaPrefs');
    if (prefs) {
      setUserPrefs(JSON.parse(prefs));
    }
  }, []);

  const validateAadhar = (number) => {
    // Aadhar number regex: 12 digits, no spaces
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(number);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 12) {
      setAadharNumber(value);
      setError('');
      setIsValid(validateAadhar(value));
    }
  };

  const formatAadharDisplay = (number) => {
    // Format as XXXX XXXX XXXX for display
    return number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!isValid) {
      setError(t('login.errors.invalidAadhar'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation - Accept any 12-digit number except specific test cases
      const testInvalidNumbers = ['123456789012', '000000000000', '111111111111'];
      
      if (testInvalidNumbers.includes(aadharNumber)) {
        throw new Error('Invalid Aadhar number');
      }

      // Store login info
      const loginData = {
        aadharNumber: aadharNumber,
        loginTime: new Date().toISOString(),
        isAuthenticated: true
      };
      
      localStorage.setItem('graminSwasthyaAuth', JSON.stringify(loginData));
      
      // Navigate to home
      navigate('/home');
      
    } catch (err) {
      setError(t('login.errors.authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    // Simulate voice input for illiterate users
    if (userPrefs?.mode === 'voice-only') {
      alert(t('login.voiceInputActivated'));
      // In real implementation, this would use Web Speech API
      setTimeout(() => {
        const mockAadhar = '123456789012';
        setAadharNumber(mockAadhar);
        setIsValid(validateAadhar(mockAadhar));
      }, 2000);
    }
  };

  const isVoiceMode = userPrefs?.mode === 'voice-only';

  return (
    <MotionWrapper className="login-container" variant="container" stagger={true}>
      <div className="login-header">
        <h1>🔐 {t('login.title')}</h1>
        <p>{t('login.subtitle')}</p>
      </div>

      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="aadhar">
              📄 {t('login.aadharNumber')}
            </label>
            
            <div className="input-container">
              <input
                type="text"
                id="aadhar"
                value={aadharNumber}
                onChange={handleInputChange}
                placeholder={t('login.placeholder')}
                className={`aadhar-input ${isValid ? 'valid' : ''} ${error ? 'error' : ''}`}
                maxLength="12"
                required
              />
              
              {isVoiceMode && (
                <button
                  type="button"
                  className="voice-btn"
                  onClick={handleVoiceInput}
                  title="Voice Input"
                >
                  🎤
                </button>
              )}
            </div>

            {aadharNumber && (
              <div className="formatted-display">
                {formatAadharDisplay(aadharNumber)}
              </div>
            )}

            <div className="validation-info">
              <div className={`requirement ${aadharNumber.length === 12 ? 'met' : ''}`}>
                ✓ {t('login.validation.digits')}
              </div>
              <div className={`requirement ${/^\d+$/.test(aadharNumber) ? 'met' : ''}`}>
                ✓ {t('login.validation.numbersOnly')}
              </div>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`login-btn ${isValid ? 'enabled' : 'disabled'}`}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner">⟳</span>
                {t('login.verifying')}
              </>
            ) : (
              t('login.loginButton')
            )}
          </button>
        </form>

        {/* Demo Information */}
        <div className="demo-info">
          <h4>🧪 {t('login.demo.title')}</h4>
          <p>{t('login.demo.description')}</p>
          
          <div className="sample-numbers">
            <strong>{t('login.demo.sampleAadhar')}</strong> 456789123456
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="privacy-notice">
          <p>🔒 {t('login.privacy.secure')}</p>
        </div>
      </div>

      {/* Language Selection Link */}
      <div className="back-link">
        <button onClick={() => navigate('/language')} className="back-btn">
          ← {t('login.changeLanguage')}
        </button>
      </div>
    </MotionWrapper>
  );
};

export default Login;