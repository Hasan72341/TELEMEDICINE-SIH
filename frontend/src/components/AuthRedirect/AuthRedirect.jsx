import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has selected language and logged in
    const auth = localStorage.getItem('graminSwasthyaAuth');
    const prefs = localStorage.getItem('graminSwasthyaPrefs');

    if (!prefs) {
      // No language selected, redirect to language selection
      navigate('/language');
    } else if (!auth) {
      // Language selected but not logged in
      navigate('/login');
    } else {
      // Both language and auth exist, go to new home
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏥</div>
        <h2>Gramin Swasthya</h2>
        <p>Loading your health dashboard...</p>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthRedirect;