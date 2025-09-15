import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🏥</span>
              <span className="logo-text">Gramin Swasthya</span>
            </div>
            <p className="footer-description">
              {t('footer.description')}
            </p>
          </div>

          <div className="footer-section">
            <h4>{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('navigation.home')}</Link></li>
              <li><Link to="/doctors">{t('footer.findDoctors')}</Link></li>
              <li><Link to="/how-it-works">{t('navigation.howItWorks')}</Link></li>
              <li><Link to="/contact">{t('navigation.contact')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('footer.contactInfo')}</h4>
            <div className="contact-info">
              <p>📞 {t('footer.phone')}</p>
              <p>✉️ {t('footer.email')}</p>
              <p>📍 {t('footer.address')}</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Gramin Swasthya. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
