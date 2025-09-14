import React from "react";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import StepCard from "../../components/Cards/StepCard";
import howItWorksData from "../../data/howItWorks.json";
import "./howitworks.css";

const HowItWorks = () => {
  return (
    <MotionWrapper className="howitworks-container" variant="container" stagger={true}>
      <div className="page-header">
        <h1 className="page-title">How Gramin Swasthya Works</h1>
        <p className="page-subtitle">Getting quality healthcare has never been this simple. Follow these easy steps to start your telemedicine journey in rural India.</p>
      </div>

      <div className="steps-section">
        <div className="steps-grid">
          {howItWorksData.steps.map((s) => (
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
        <h2>{howItWorksData.cta.title}</h2>
        <p>{howItWorksData.cta.description}</p>
        <div className="cta-buttons">
          <button className="cta-btn primary">{howItWorksData.cta.primary}</button>
          <button className="cta-btn secondary">{howItWorksData.cta.secondary}</button>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default HowItWorks;
