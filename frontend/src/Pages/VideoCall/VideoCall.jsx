import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import doctorsData from '../../data/doctors.json';
import "./VideoCall.css";

const VideoCall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatScrollRef = useRef(null);
  
  const [userPrefs, setUserPrefs] = useState(null);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, connected, ended
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Simulated consultation data
  const consultationInfo = {
    appointmentId: 'APPT_2025_001',
    patientName: 'राहुल शर्मा',
    consultationType: 'General Checkup',
    scheduledTime: '2:30 PM',
    symptoms: ['बुखार', 'सिरदर्द', 'खांसी']
  };

  useEffect(() => {
    // Load user preferences
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    setUserPrefs(prefs);

    // Get doctor info from location state or default
    const doctorId = location.state?.doctorId || 'dr_sharma';
    const doctor = doctorsData.doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);

    // Initialize simulated video call
    initializeVideoCall();

    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Simulate connection status changes
    setTimeout(() => setCallStatus('connected'), 3000);

    // Add initial chat messages
    setTimeout(() => {
      addSystemMessage('डॉक्टर कॉल में शामिल हो गए हैं');
      setTimeout(() => {
        addDoctorMessage('नमस्ते! मैं डॉ. शर्मा हूं। आज आपकी तबीयत कैसी है?');
      }, 2000);
    }, 4000);

    return () => {
      clearInterval(timer);
      cleanupVideoCall();
    };
  }, []);

  const initializeVideoCall = async () => {
    try {
      // Simulate getting user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate doctor's video (placeholder)
      setTimeout(() => {
        if (remoteVideoRef.current) {
          // Create a colored canvas as placeholder for doctor video
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, 640, 480);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 640, 480);
          
          // Add doctor icon
          ctx.font = '120px serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = 'white';
          ctx.fillText('👨‍⚕️', 320, 280);
          
          const stream = canvas.captureStream();
          remoteVideoRef.current.srcObject = stream;
        }
      }, 2000);

    } catch (error) {
      console.log('Simulated video call - camera access simulated');
      // Create placeholder for local video
      simulateLocalVideo();
    }
  };

  const simulateLocalVideo = () => {
    if (localVideoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 320, 240);
      ctx.font = '60px serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#666';
      ctx.fillText('👤', 160, 150);
      
      const stream = canvas.captureStream();
      localVideoRef.current.srcObject = stream;
    }
  };

  const cleanupVideoCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const addSystemMessage = (message) => {
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      text: message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const addDoctorMessage = (message) => {
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'doctor',
      text: message,
      timestamp: new Date().toLocaleTimeString(),
      sender: selectedDoctor?.name || 'Doctor'
    }]);
  };

  const addPatientMessage = (message) => {
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'patient',
      text: message,
      timestamp: new Date().toLocaleTimeString(),
      sender: consultationInfo.patientName
    }]);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    addSystemMessage(isScreenSharing ? 'स्क्रीन शेयरिंग बंद की गई' : 'स्क्रीन शेयरिंग शुरू की गई');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      addPatientMessage(newMessage);
      setNewMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        const responses = [
          'समझ गया। कृपया और बताएं।',
          'यह जानकारी उपयोगी है।',
          'क्या आपको कोई और लक्षण हैं?',
          'मैं आपकी जांच करूंगा।'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addDoctorMessage(randomResponse);
      }, 2000);
    }
  };

  const endCall = () => {
    setShowEndConfirm(true);
  };

  const confirmEndCall = () => {
    setCallStatus('ended');
    cleanupVideoCall();
    
    // Generate consultation summary
    const summary = {
      doctorName: selectedDoctor?.name,
      duration: formatDuration(callDuration),
      notes: consultationNotes,
      prescription: 'पेरासिटामोल 500mg दिन में दो बार\nआराम करें और तरल पदार्थ लें',
      followUp: '3 दिन बाद फॉलो-अप'
    };
    
    localStorage.setItem('lastConsultationSummary', JSON.stringify(summary));
    
    setTimeout(() => {
      navigate('/consultation-summary', { state: { summary } });
    }, 2000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return '📶';
      case 'good': return '📶';
      case 'poor': return '📶';
      default: return '📶';
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (callStatus === 'ended') {
    return (
      <MotionWrapper>
        <div className="video-call-container call-ended">
          <div className="call-ended-screen">
            <div className="call-ended-icon">📞</div>
            <h2>कॉल समाप्त हो गई</h2>
            <p>परामर्श की अवधि: {formatDuration(callDuration)}</p>
            <p>रिपोर्ट तैयार की जा रही है...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper>
      <div className="video-call-container">
        {/* Header */}
        <div className="call-header">
          <div className="call-info">
            <div className="appointment-id">#{consultationInfo.appointmentId}</div>
            <div className="call-status">
              <span className={`status-indicator ${callStatus}`}></span>
              {callStatus === 'connecting' ? 'कनेक्ट हो रहा है...' : 'कनेक्टेड'}
            </div>
            <div className="call-duration">{formatDuration(callDuration)}</div>
          </div>
          <div className="connection-quality">
            <span className="connection-icon">{getConnectionIcon()}</span>
            <span className="connection-text">{connectionQuality}</span>
          </div>
        </div>

        {/* Main Call Interface */}
        <div className="call-main">
          {/* Video Section */}
          <div className="video-section">
            {/* Remote Video (Doctor) */}
            <div className="remote-video-container">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="remote-video"
              />
              <div className="video-overlay doctor-overlay">
                <div className="doctor-info">
                  <span className="doctor-name">{selectedDoctor?.name}</span>
                  <span className="doctor-specialization">{selectedDoctor?.specialization}</span>
                </div>
                <div className="video-controls-overlay">
                  <button className="overlay-btn" onClick={() => setIsVideoOn(!isVideoOn)}>
                    {isVideoOn ? '📹' : '📹'}
                  </button>
                  <button className="overlay-btn" onClick={() => setIsAudioOn(!isAudioOn)}>
                    {isAudioOn ? '🔊' : '🔇'}
                  </button>
                </div>
              </div>
            </div>

            {/* Local Video (Patient) */}
            <div className="local-video-container">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`local-video ${!isVideoOn ? 'video-off' : ''}`}
              />
              <div className="video-overlay patient-overlay">
                <span className="patient-name">{consultationInfo.patientName}</span>
                {!isVideoOn && <div className="video-off-indicator">📹</div>}
                {!isAudioOn && <div className="audio-off-indicator">🔇</div>}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="side-panel">
            {/* Patient Info */}
            <div className="patient-info-card">
              <h3>मरीज़ की जानकारी</h3>
              <div className="info-item">
                <span className="label">नाम:</span>
                <span className="value">{consultationInfo.patientName}</span>
              </div>
              <div className="info-item">
                <span className="label">समय:</span>
                <span className="value">{consultationInfo.scheduledTime}</span>
              </div>
              <div className="info-item">
                <span className="label">प्रकार:</span>
                <span className="value">{consultationInfo.consultationType}</span>
              </div>
              <div className="info-item">
                <span className="label">लक्षण:</span>
                <div className="symptoms-list">
                  {consultationInfo.symptoms.map((symptom, index) => (
                    <span key={index} className="symptom-tag">{symptom}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="chat-section">
              <div className="chat-header">
                <h3>चैट</h3>
                <button 
                  className="notes-toggle"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  📝
                </button>
              </div>
              
              {!showNotes ? (
                <>
                  <div className="chat-messages" ref={chatScrollRef}>
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`message ${message.type}`}>
                        {message.type === 'system' ? (
                          <div className="system-message">
                            <span className="system-text">{message.text}</span>
                            <span className="timestamp">{message.timestamp}</span>
                          </div>
                        ) : (
                          <div className="chat-message">
                            <div className="message-header">
                              <span className="sender">{message.sender}</span>
                              <span className="timestamp">{message.timestamp}</span>
                            </div>
                            <div className="message-text">{message.text}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="chat-input">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="संदेश टाइप करें..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} className="send-btn">
                      📤
                    </button>
                  </div>
                </>
              ) : (
                <div className="notes-section">
                  <h4>परामर्श नोट्स</h4>
                  <textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    placeholder="डॉक्टर के नोट्स यहाँ दिखेंगे..."
                    rows="10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="call-controls">
          <div className="control-group primary-controls">
            <button 
              className={`control-btn ${!isAudioOn ? 'disabled' : ''}`}
              onClick={toggleAudio}
              title={isAudioOn ? 'म्यूट करें' : 'अनम्यूट करें'}
            >
              {isAudioOn ? '🎤' : '🔇'}
            </button>
            
            <button 
              className={`control-btn ${!isVideoOn ? 'disabled' : ''}`}
              onClick={toggleVideo}
              title={isVideoOn ? 'वीडियो बंद करें' : 'वीडियो चालू करें'}
            >
              {isVideoOn ? '📹' : '📹'}
            </button>
            
            <button 
              className="control-btn end-call"
              onClick={endCall}
              title="कॉल समाप्त करें"
            >
              📞
            </button>
          </div>
          
          <div className="control-group secondary-controls">
            <button 
              className={`control-btn ${isScreenSharing ? 'active' : ''}`}
              onClick={toggleScreenShare}
              title="स्क्रीन शेयर करें"
            >
              🖥️
            </button>
            
            <button 
              className="control-btn"
              onClick={() => setShowNotes(!showNotes)}
              title="नोट्स"
            >
              📝
            </button>
            
            <button 
              className="control-btn"
              title="सेटिंग्स"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* End Call Confirmation Modal */}
        {showEndConfirm && (
          <div className="modal-overlay">
            <div className="end-call-modal">
              <h3>कॉल समाप्त करें?</h3>
              <p>क्या आप वाकई परामर्श समाप्त करना चाहते हैं?</p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowEndConfirm(false)}
                >
                  रद्द करें
                </button>
                <button 
                  className="confirm-btn"
                  onClick={confirmEndCall}
                >
                  हाँ, समाप्त करें
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MotionWrapper>
  );
};

export default VideoCall;