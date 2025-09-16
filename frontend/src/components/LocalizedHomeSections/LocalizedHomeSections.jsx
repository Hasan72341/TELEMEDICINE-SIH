import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedContent } from '../../utils/i18nUtils';
import homeData from '../../data/home.json';

const FeaturesSection = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {homeData.features.map((feature) => (
            <div key={feature.id} className={`feature-card ${feature.variant || ''}`}>
              <div className="feature-icon">
                <span>{feature.icon}</span>
              </div>
              
              <div className="feature-content">
                <h3 className="feature-title">
                  {useLocalizedContent(feature.title, feature.title)}
                </h3>
                
                <p className="feature-description">
                  {useLocalizedContent(feature.description, feature.description)}
                </p>
                
                {feature.cta && (
                  <button className="feature-cta">
                    {useLocalizedContent(feature.cta, feature.cta)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="services-section">
      <div className="container">
        <h2 className="section-title">{t('home.mainServices')}</h2>
        
        <div className="services-grid">
          {homeData.services.map((service) => (
            <div key={service.id} className="service-card">
              <h3 className="service-title">
                {useLocalizedContent(service.title, service.title)}
              </h3>
              
              <p className="service-description">
                {useLocalizedContent(service.description, service.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Example of how to use the updated data files
const LocalizedHomeSections = () => {
  return (
    <div className="localized-home">
      <FeaturesSection />
      <ServicesSection />
    </div>
  );
};

export default LocalizedHomeSections;