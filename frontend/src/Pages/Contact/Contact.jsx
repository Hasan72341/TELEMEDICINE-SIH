import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import "./Contact.css";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <MotionWrapper className="contact-container" variant="container" stagger={true}>
      <div className="page-header">
        <h1 className="page-title">{t('contact.title')}</h1>
        <p className="page-subtitle">{t('contact.subtitle')}</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h3>{t('contact.getInTouch')}</h3>
          <div className="info-item">
            <span className="icon">📞</span>
            <div>
              <h4>{t('contact.info.phone')}</h4>
              <p>{t('footer.phone')}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">✉️</span>
            <div>
              <h4>{t('contact.info.email')}</h4>
              <p>{t('footer.email')}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📍</span>
            <div>
              <h4>{t('contact.info.address')}</h4>
              <p>{t('footer.address')}</p>
            </div>
          </div>
        </div>

                <div className="contact-form">
          <h3>{t('contact.sendMessage')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder={t('contact.form.name')}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder={t('contact.form.email')}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"  
                name="subject"
                placeholder={t('contact.form.subject')}
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder={t('contact.form.message')}
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">{t('contact.form.send')}</button>
          </form>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default Contact;
