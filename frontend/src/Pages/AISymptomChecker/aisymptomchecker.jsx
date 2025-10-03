import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import "./aisymptomchecker.css";

const AISymptomChecker = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userPrefs, setUserPrefs] = useState({});
  const [currentStep, setCurrentStep] = useState('welcome');
  const [inputMethod, setInputMethod] = useState('text');
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const DEFAULT_HEADACHE_RESPONSE = t('aiSymptomChecker.defaultResponse');

  // Initialize component with safety checks
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('userPrefs') || '{}');
    setUserPrefs(prefs);
    
    // Clear any invalid symptoms that might be lingering from previous sessions
    if (symptoms === 'cd' || symptoms.length < 3) {
      setSymptoms('');
    }
  }, []);

  // Clear symptoms if they contain invalid content
  useEffect(() => {
    if (symptoms === 'cd' || (symptoms.length > 0 && symptoms.length < 3 && !symptoms.match(/[a-zA-Z\u0900-\u097F\u0A00-\u0A7F]/))) {
      setSymptoms('');
    }
  }, [symptoms]);

  // Quick select removed

  // Follow-up questions for interaction
  const followUpQuestions = [
    {
      id: 'duration',
      question: t('aiSymptomChecker.questions.duration.question'),
      options: [
        { value: 'few_hours', text: t('aiSymptomChecker.questions.duration.options.fewHours'), weight: 1 },
        { value: '1_day', text: t('aiSymptomChecker.questions.duration.options.oneDay'), weight: 1.2 },
        { value: '2_3_days', text: t('aiSymptomChecker.questions.duration.options.twoDays'), weight: 1.5 },
        { value: 'week', text: t('aiSymptomChecker.questions.duration.options.week'), weight: 2 }
      ]
    },
    {
      id: 'severity',
      question: t('aiSymptomChecker.questions.severity.question'),
      options: [
        { value: 'mild', text: t('aiSymptomChecker.questions.severity.options.mild'), weight: 1 },
        { value: 'moderate', text: t('aiSymptomChecker.questions.severity.options.moderate'), weight: 1.5 },
        { value: 'severe', text: t('aiSymptomChecker.questions.severity.options.severe'), weight: 2 }
      ]
    }
  ];

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set language based on current i18n language
    const rawLang = localStorage.getItem('i18nextLng') || 'en';
    const normalizedLang = rawLang.startsWith('hi') ? 'hi' : 
                          rawLang.startsWith('pa') ? 'pa' : 'en';
    recognition.lang = normalizedLang === 'hi' ? 'hi-IN' : 
                      normalizedLang === 'pa' ? 'pa-IN' : 'en-US';

    setIsListening(true);

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Quick select removed

  const proceedToQuestions = () => {
    setCurrentStep('questions');
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    if (currentQuestionIndex < followUpQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      startAIAnalysis();
    }
  };

  const startAIAnalysis = () => {
    setCurrentStep('analysis');
    setAnalysisProgress(0);
    
    const stages = [
      t('aiSymptomChecker.analysis.stages.processing'),
      t('aiSymptomChecker.analysis.stages.analyzing'),
      t('aiSymptomChecker.analysis.stages.generating'),
      t('aiSymptomChecker.analysis.stages.finalizing')
    ];

    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setAnalysisStage(stages[stageIndex]);
        stageIndex++;
      }
    }, 800);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stageInterval);
          setTimeout(() => {
            performAdvancedMatching();
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 400);
  };

  const performAdvancedMatching = async () => {
    try {
      // Get current language and normalize it
      const rawLang = localStorage.getItem('i18nextLng') || 'en';
      
      // Normalize language code to only allowed values: en, hi, pa
      const normalizeLanguage = (lang) => {
        if (lang.startsWith('hi')) return 'hi';
        if (lang.startsWith('pa')) return 'pa';
        return 'en'; // Default to English for any other language
      };
      
      const currentLang = normalizeLanguage(rawLang);
      
      // Determine the correct API base URL
      const getApiBaseUrl = () => {
        // Use environment variable if available
        if (import.meta.env.VITE_API_BASE_URL) {
          return import.meta.env.VITE_API_BASE_URL;
        }
        
        // Fallback logic for development
        if (import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          return 'http://localhost:8006';
        }
        
        // Fallback for production/network access
        return 'http://172.16.8.115:8006';
      };
      
      const apiBaseUrl = getApiBaseUrl();
      
      // Call your FastAPI backend
      const response = await fetch(`${apiBaseUrl}/remedy?symptom=${encodeURIComponent(symptoms)}&lang=${currentLang}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Format the AI response from your API
      const formattedResponse = `🎯 ${t('aiSymptomChecker.results.condition')}: ${data.symptom}

📝 ${t('aiSymptomChecker.sampleResponse.symptomsLabel')}: ${data.description}

🏠 ${t('aiSymptomChecker.sampleResponse.homeRemediesLabel')}:

${data.remedy}

🌍 ${t('aiSymptomChecker.results.language')}: ${data.language.name} (${Math.round(data.language.confidence * 100)}% ${t('aiSymptomChecker.results.confident')})`;

      setAiResponse(formattedResponse);
      setCurrentStep('results');
      
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Fallback to default response if API fails
      generateFallbackResponse();
      setCurrentStep('results');
    }
  };

  const generateFallbackResponse = () => {
    // Fallback response if API is unavailable
    const fallbackResponse = `⚠️ ${t('aiSymptomChecker.fallback.apiUnavailable')}

🎯 ${t('aiSymptomChecker.fallback.generalAdvice')}:

🏠 ${t('aiSymptomChecker.fallback.basicRemedies')}:

• ${t('aiSymptomChecker.fallback.remedy1')}
• ${t('aiSymptomChecker.fallback.remedy2')}
• ${t('aiSymptomChecker.fallback.remedy3')}

💡 ${t('aiSymptomChecker.fallback.suggestion')}`;

    setAiResponse(fallbackResponse);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const rawLang = localStorage.getItem('i18nextLng') || 'en';
      const normalizedLang = rawLang.startsWith('hi') ? 'hi' : 
                            rawLang.startsWith('pa') ? 'pa' : 'en';
      utterance.lang = normalizedLang === 'hi' ? 'hi-IN' : 
                       normalizedLang === 'pa' ? 'pa-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const startOver = () => {
    setCurrentStep('welcome');
    setSymptoms('');
  // Quick select removed
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setAnalysisProgress(0);
    setAiResponse('');
  };

  const currentQuestion = followUpQuestions[currentQuestionIndex];

  const renderContent = () => {
    try {
      return (
        <MotionWrapper className="ai-symptom-checker-container" variant="container">
          <div className="ai-header">
            <button onClick={() => navigate('/home')} className="back-btn">
              ← {t('common.back')} {t('navigation.home')}
            </button>
            <h1>🤖 {t('aiSymptomChecker.title')}</h1>
            <p>{t('aiSymptomChecker.subtitle')}</p>
          </div>

          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="welcome-section">
              <div className="ai-avatar">
                <div className="avatar-circle">🤖</div>
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              
              <div className="welcome-content">
                <h2>👋 {t('aiSymptomChecker.welcome.greeting')}</h2>
                <p>{t('aiSymptomChecker.welcome.description')}</p>
                
                <div className="ai-features">
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>{t('aiSymptomChecker.features.accurate')}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🏠</span>
                    <span>{t('aiSymptomChecker.features.natural')}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚡</span>
                    <span>{t('aiSymptomChecker.features.instant')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentStep('input')} 
                  className="start-analysis-btn"
                >
                  🚀 {t('aiSymptomChecker.startAnalysis')}
                </button>
              </div>
            </div>
          )}

          {/* Input Step */}
          {currentStep === 'input' && (
            <div className="input-section">
              <h2>🩺 {t('aiSymptomChecker.input.title')}</h2>
              
              <div className="input-method-selector">
                <button 
                  className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
                  onClick={() => setInputMethod('text')}
                >
                  ✍️ {t('aiSymptomChecker.input.typeSymptoms')}
                </button>
                <button 
                  className={`method-btn ${inputMethod === 'voice' ? 'active' : ''}`}
                  onClick={() => setInputMethod('voice')}
                >
                  🎤 {t('aiSymptomChecker.input.voiceInput')}
                </button>
              </div>

              {inputMethod === 'text' && (
                <div className="text-input-section">
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder={t('aiSymptomChecker.input.placeholder')}
                    className="symptoms-textarea"
                    rows="4"
                  />
                </div>
              )}

              {inputMethod === 'voice' && (
                <div className="voice-input-section">
                  <div className={`voice-recorder ${isListening ? 'listening' : ''}`}>
                    <button 
                      onClick={startListening} 
                      className="voice-btn"
                      disabled={isListening}
                    >
                      {isListening ? t('aiSymptomChecker.input.listening') : t('aiSymptomChecker.input.clickToSpeak')}
                    </button>
                    {symptoms && (
                      <div className="voice-transcript">
                        <p>📝 {t('aiSymptomChecker.input.youSaid')}: "{symptoms}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {symptoms && (
                <div className="proceed-section">
                  <div className="symptoms-summary">
                    <h4>{t('aiSymptomChecker.symptoms')}:</h4>
                    <div>
                      <span className="described-symptoms">📝 "{symptoms}"</span>
                    </div>
                  </div>
                  
                  <button onClick={proceedToQuestions} className="proceed-btn">
                    {t('aiSymptomChecker.continueAnalysis')} →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Questions Step */}
          {currentStep === 'questions' && currentQuestion && (
            <div className="questions-section">
              <div className="question-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentQuestionIndex + 1) / followUpQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <p>{t('aiSymptomChecker.question')} {currentQuestionIndex + 1} {t('aiSymptomChecker.of')} {followUpQuestions.length}</p>
              </div>

              <div className="question-card">
                <h3>{currentQuestion.question}</h3>
                
                <div className="answer-options">
                  {currentQuestion.options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className="option-btn"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analysis Step */}
          {currentStep === 'analysis' && (
            <div className="analysis-section">
              <div className="analysis-animation">
                <div className="ai-brain">🧠</div>
                <div className="processing-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>

              <div className="analysis-status">
                <h2>🔍 {t('aiSymptomChecker.analysis.title')}</h2>
                <p className="analysis-stage">{analysisStage}</p>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{Math.round(analysisProgress)}% {t('aiSymptomChecker.analysis.complete')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && (
            <div className="results-section">
              <div className="results-header">
                <h2>🎯 {t('aiSymptomChecker.results.title')}</h2>
                <div className="ai-confidence">
                  <span className="confidence-label">{t('aiSymptomChecker.results.confidenceLevel')}:</span>
                  <span className="confidence-score">85%</span>
                </div>
              </div>

              <div className="ai-response-card">
                <div className="ai-avatar-small">🤖</div>
                <div className="ai-response-content">
                  <h3>{t('aiSymptomChecker.results.assistantSays')}:</h3>
                  <div className="ai-response-text">
                    {(aiResponse || DEFAULT_HEADACHE_RESPONSE).split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                  {userPrefs.mode === 'voice-only' && (
                    <button 
                      onClick={() => speakText(aiResponse)} 
                      className="listen-response-btn"
                    >
                      🔊 {t('aiSymptomChecker.results.listenToAnalysis')}
                    </button>
                  )}
                </div>
              </div>

              <div className="results-actions">
                <button onClick={startOver} className="new-analysis-btn">
                  🔄 {t('aiSymptomChecker.results.newAnalysis')}
                </button>
                <button 
                  onClick={() => navigate('/consultation')} 
                  className="book-consultation-btn"
                >
                  👩‍⚕️ {t('aiSymptomChecker.results.bookConsultation')}
                </button>
                <button 
                  onClick={() => navigate('/shop')} 
                  className="buy-medicines-btn"
                >
                  🌿 {t('aiSymptomChecker.results.getNaturalRemedies')}
                </button>
              </div>

              <div className="disclaimer">
                <h4>📋 {t('aiSymptomChecker.disclaimer.title')}:</h4>
                <p>
                  {t('aiSymptomChecker.disclaimer.text')}
                </p>
              </div>
            </div>
          )}
        </MotionWrapper>
      );
    } catch (error) {
      console.error('Error rendering AI Symptom Checker:', error);
      return (
        <MotionWrapper className="ai-symptom-checker-container" variant="container">
          <div className="error-fallback">
            <h2>🏠 {t('aiSymptomChecker.title')}</h2>
            <div className="ai-response-card">
              <div className="ai-avatar-small">🤖</div>
              <div className="ai-response-content">
                <h3>{t('aiSymptomChecker.fallback.quickSuggestion')}:</h3>
                <div className="ai-response-text">
                  <p>🤧 {t('aiSymptomChecker.fallback.commonCold')}</p>
                  <p>{t('aiSymptomChecker.fallback.symptoms')}: {t('aiSymptomChecker.fallback.coldSymptoms')}</p>
                  <p>{t('aiSymptomChecker.fallback.homeRemedies')}:</p>
                  <p>{t('aiSymptomChecker.fallback.remedy1')}</p>
                  <p>{t('aiSymptomChecker.fallback.remedy2')}</p>
                  <p>{t('aiSymptomChecker.fallback.remedy3')}</p>
                </div>
              </div>
            </div>
            <div className="results-actions">
              <button onClick={() => window.location.reload()} className="new-analysis-btn">
                🔄 {t('common.retry')}
              </button>
              <button onClick={() => navigate('/home')} className="back-btn">
                ← {t('common.back')} {t('navigation.home')}
              </button>
            </div>
          </div>
        </MotionWrapper>
      );
    }
  };

  return renderContent();
};

export default AISymptomChecker;