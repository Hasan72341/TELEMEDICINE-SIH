import React from "react";
import { useTranslation } from "react-i18next";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import StepCard from "../../components/Cards/StepCard";
import "./HowItWorks.css";

const HowItWorks = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      id: 1,
      number: "01",
      icon: "👤",
      title: t('howItWorks.steps.createAccount.title'),
      description: t('howItWorks.steps.createAccount.description')
    },
    {
      id: 2,
      number: "02",
      icon: "👨‍⚕️",
      title: t('howItWorks.steps.chooseDoctor.title'),
      description: t('howItWorks.steps.chooseDoctor.description')
    },
    {
      id: 3,
      number: "03",
      icon: "📅",
      title: t('howItWorks.steps.bookAppointment.title'),
      description: t('howItWorks.steps.bookAppointment.description')
    }
  ];

  return (
    <MotionWrapper className="howitworks-container" variant="container" stagger={true}>
      <div className="page-header">
        <h1 className="page-title">{t('howItWorks.title')}</h1>
        <p className="page-subtitle">{t('howItWorks.subtitle')}</p>
      </div>

      <div className="steps-section">
        <div className="steps-grid">
          {steps.map((s) => (
            <StepCard
              key={s.id}
              number={s.number}
              icon={s.icon}
              title={s.title}
              description={s.description}
            />
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2>{t('howItWorks.cta.title')}</h2>
        <p>{t('howItWorks.cta.description')}</p>
        <div className="cta-buttons">
          <button className="cta-btn primary">{t('howItWorks.cta.primary')}</button>
          <button className="cta-btn secondary">{t('howItWorks.cta.secondary')}</button>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default HowItWorks;
