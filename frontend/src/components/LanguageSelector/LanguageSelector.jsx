import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'pa', name: 'ਪੰਜਾਬੀ', displayName: 'Punjabi' },
    { code: 'hi', name: 'हिंदी', displayName: 'Hindi' },
    { code: 'en', name: 'English', displayName: 'English' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
  };

  return (
    <div className="language-selector">
      <div className="dropdown">
        <button className="dropdown-button">
          <span className="current-language">{currentLanguage.name}</span>
          <svg className="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="dropdown-content">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
              onClick={() => changeLanguage(language.code)}
            >
              <span className="language-native">{language.name}</span>
              <span className="language-english">({language.displayName})</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .language-selector {
          position: relative;
          z-index: 1000;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 111, 0, 0.3);
          border-radius: 8px;
          color: #1a1a1a;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .dropdown-button:hover {
          background: rgba(255, 111, 0, 0.1);
          border-color: rgba(255, 111, 0, 0.5);
          transform: translateY(-2px);
        }

        .dropdown-arrow {
          transition: transform 0.3s ease;
        }

        .dropdown:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .dropdown-content {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 111, 0, 0.2);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .dropdown:hover .dropdown-content {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .language-option {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          color: #1a1a1a;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(255, 111, 0, 0.1);
        }

        .language-option:last-child {
          border-bottom: none;
        }

        .language-option:hover {
          background: rgba(255, 111, 0, 0.1);
          transform: translateX(4px);
        }

        .language-option.active {
          background: rgba(255, 111, 0, 0.15);
          color: #e65100;
        }

        .language-native {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .language-english {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 400;
        }

        .language-option.active .language-english {
          color: #ff6f00;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .dropdown-content {
            right: -20px;
            min-width: 180px;
          }
          
          .dropdown-button {
            padding: 6px 10px;
            font-size: 0.8rem;
          }
          
          .language-option {
            padding: 10px 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;