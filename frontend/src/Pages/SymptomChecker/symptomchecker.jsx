import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import remediesData from '../../data/remedies.json';
import "./symptomchecker.css";

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [userPrefs, setUserPrefs] = useState(null);
  const [currentStep, setCurrentStep] = useState('input'); // input, analysis, results
  const [inputMethod, setInputMethod] = useState('text'); // text, voice
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [matchedRemedies, setMatchedRemedies] = useState([]);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);

  useEffect(() => {
    // Check authentication and preferences
    const auth = localStorage.getItem('graminSwasthyaAuth');
    const prefs = localStorage.getItem('graminSwasthyaPrefs');
    
    if (!auth) {
      navigate('/language');
      return;
    }
    
    if (prefs) {
      const preferences = JSON.parse(prefs);
      setUserPrefs(preferences);
      if (preferences.mode === 'voice-only') {
        setInputMethod('voice');
      }
    }

    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsVoiceSupported(true);
    }
  }, [navigate]);

  const commonSymptoms = [
    { id: 'fever', text: 'Fever / बुखार', keywords: ['fever', 'बुखार', 'गर्मी'] },
    { id: 'headache', text: 'Headache / सिरदर्द', keywords: ['headache', 'सिरदर्द', 'सिर में दर्द'] },
    { id: 'cough', text: 'Cough / खांसी', keywords: ['cough', 'खांसी', 'खांसना'] },
    { id: 'cold', text: 'Cold / सर्दी', keywords: ['cold', 'सर्दी', 'जुकाम'] },
    { id: 'stomach', text: 'Stomach Pain / पेट दर्द', keywords: ['stomach', 'पेट', 'दर्द', 'पेट दर्द'] },
    { id: 'body-ache', text: 'Body Ache / शरीर दर्द', keywords: ['body ache', 'शरीर दर्द', 'बदन दर्द'] },
    { id: 'nausea', text: 'Nausea / मतली', keywords: ['nausea', 'मतली', 'उल्टी'] },
    { id: 'diarrhea', text: 'Diarrhea / दस्त', keywords: ['diarrhea', 'दस्त', 'लूज मोशन'] }
  ];

  const startVoiceInput = () => {
    if (!isVoiceSupported) {
      alert('Voice input not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = userPrefs?.language === 'hindi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      // Simulate voice input for demo
      setTimeout(() => {
        setSymptoms('I have fever and headache since yesterday');
      }, 2000);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const analyzeSymptoms = () => {
    if (!symptoms.trim()) {
      alert('Please describe your symptoms first');
      return;
    }

    setCurrentStep('analysis');
    setAnalysisProgress(0);

    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            findMatchingRemedies();
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const findMatchingRemedies = () => {
    const symptomsLower = symptoms.toLowerCase();
    const matches = [];

    remediesData.remedies.forEach(remedy => {
      const matchScore = remedy.symptoms.reduce((score, symptom) => {
        if (symptomsLower.includes(symptom.toLowerCase())) {
          return score + 1;
        }
        // Check for keyword matches
        const hasKeywordMatch = commonSymptoms.some(common => 
          common.keywords.some(keyword => 
            symptomsLower.includes(keyword.toLowerCase()) && 
            symptom.toLowerCase().includes(common.id)
          )
        );
        return hasKeywordMatch ? score + 0.5 : score;
      }, 0);

      if (matchScore > 0) {
        matches.push({ ...remedy, matchScore });
      }
    });

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);
    setMatchedRemedies(matches);
    setCurrentStep('results');
  };

  const startOver = () => {
    setCurrentStep('input');
    setSymptoms('');
    setMatchedRemedies([]);
    setAnalysisProgress(0);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userPrefs?.language === 'hindi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  if (!userPrefs) {
    return <div>Loading...</div>;
  }

  return (
    <MotionWrapper className="symptom-checker-container" variant="container">
      <div className="symptom-checker-header">
        <button onClick={() => navigate('/home')} className="back-btn">
          ← Back to Home
        </button>
        <h1>🤖 AI Symptom Checker</h1>
        <p>Analyze your symptoms and get information about potential conditions.</p>
      </div>

      {currentStep === 'input' && (
        <div className="input-section">
          <div className="input-method-selector">
            <button
              className={`method-btn ${inputMethod === 'text' ? 'active' : ''}`}
              onClick={() => setInputMethod('text')}
              disabled={userPrefs.mode === 'voice-only'}
            >
              📝 Text Input
            </button>
            <button
              className={`method-btn ${inputMethod === 'voice' ? 'active' : ''}`}
              onClick={() => setInputMethod('voice')}
            >
              🎤 Voice Input
            </button>
          </div>

          {inputMethod === 'text' && userPrefs.mode !== 'voice-only' && (
            <div className="text-input-section">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms in detail... / अपने लक्षणों का विस्तार से वर्णन करें..."
                className="symptoms-textarea"
                rows="4"
              />
            </div>
          )}

          {inputMethod === 'voice' && (
            <div className="voice-input-section">
              <div className="voice-input-area">
                {isListening ? (
                  <div className="listening-indicator">
                    <div className="listening-animation"></div>
                    <p>Listening... Speak clearly about your symptoms</p>
                    <p>सुन रहे हैं... अपने लक्षणों के बारे में स्पष्ट रूप से बोलें</p>
                  </div>
                ) : (
                  <div className="voice-prompt">
                    <button onClick={startVoiceInput} className="voice-btn">
                      🎤 Start Speaking
                    </button>
                    <p>Tap the microphone and describe your symptoms</p>
                    <p>माइक्रोफोन दबाएं और अपने लक्षणों का वर्णन करें</p>
                  </div>
                )}
              </div>
              
              {symptoms && (
                <div className="voice-transcript">
                  <h4>What you said:</h4>
                  <p>"{symptoms}"</p>
                  <button onClick={() => speakText(symptoms)} className="replay-btn">
                    🔊 Replay
                  </button>
                </div>
              )}
            </div>
          )}

          {symptoms && (
            <div className="analyze-section">
              <button onClick={analyzeSymptoms} className="analyze-btn">
                🔍 Analyze Symptoms
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === 'analysis' && (
        <div className="analysis-section">
          <div className="analysis-animation">
            <div className="ai-brain">🧠</div>
            <h2>AI Analysis in Progress...</h2>
            <p>Analyzing your symptoms using advanced medical AI</p>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">{analysisProgress}% Complete</p>
          </div>
        </div>
      )}

      {currentStep === 'results' && (
        <div className="results-section">
          <div className="results-header">
            <h2>📋 Analysis Results</h2>
            <p>Based on your symptoms: "{symptoms}"</p>
          </div>

          {matchedRemedies.length > 0 ? (
            <div className="remedies-list">
              {matchedRemedies.map((remedy, index) => (
                <div key={index} className="remedy-card">
                  <div className="remedy-header">
                    <h3>{remedy.condition}</h3>
                    <span className="match-score">
                      {Math.round(remedy.matchScore * 100 / remedy.symptoms.length)}% match
                    </span>
                  </div>
                  
                  <div className="remedy-content">
                    <div className="remedy-section">
                      <h4>🏠 Home Remedies:</h4>
                      <ul>
                        {(remedy.homeRemedies || []).map((homeRemedy, i) => (
                          <li key={i}>{homeRemedy}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="remedy-section">
                      <h4>💊 Suggested Medicines:</h4>
                      <ul>
                        {(remedy.medicines || []).map((medicine, i) => (
                          <li key={i}>{medicine}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="warning-section">
                      <h4>⚠️ Important:</h4>
                      <p>{remedy.warning}</p>
                    </div>

                    {userPrefs.mode === 'voice-only' && (
                      <button 
                        onClick={() => speakText(remedy.audioText)}
                        className="listen-btn"
                      >
                        🔊 Listen to Remedy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>Headache</h3>
              <p>Symptoms: Pain in head, heaviness.</p>
              <div className="home-remedies">
                <h4>Home Remedies:</h4>
                <ul>
                  <li>Drink plenty of water (dehydration often causes headache).</li>
                  <li>Apply pudina (mint) paste on forehead.</li>
                  <li>Inhale steam with eucalyptus oil or ajwain.</li>
                </ul>
              </div>
              <div className="actions-inline">
                <button onClick={() => navigate('/ai-symptom-checker')} className="consult-btn">
                  🤖 Open AI Home Remedies
                </button>
                <button onClick={() => navigate('/consultation')} className="consult-btn">
                  👩‍⚕️ Book Consultation
                </button>
              </div>
            </div>
          )}

          <div className="results-actions">
            <button onClick={startOver} className="start-over-btn">
              🔄 Check New Symptoms
            </button>
            <button onClick={() => navigate('/consultation')} className="book-consultation-btn">
              👩‍⚕️ Book Doctor Consultation
            </button>
          </div>

          <div className="disclaimer">
            <p>
              <strong>Disclaimer:</strong> This is an AI-based symptom checker for educational purposes only. 
              Always consult with a qualified healthcare professional for proper medical diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </MotionWrapper>
  );
};

export default SymptomChecker;