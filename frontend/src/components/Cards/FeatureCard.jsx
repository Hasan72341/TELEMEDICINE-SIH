import React from "react";

const FeatureCard = ({ icon, title, description, cta, variant }) => {
  const isAI = variant === "ai";
  return (
    <div className={`feature-card ${isAI ? "ai-feature-card" : ""}`}>
      {icon && <div className="feature-icon">{icon}</div>}
      <h3 className="feature-title">{title}</h3>
      {description && <p className="feature-description">{description}</p>}
      {cta && (
        <button className="feature-btn">
          {cta}
        </button>
      )}
      {isAI && (
        <small className="disclaimer">*Not a substitute for professional medical advice</small>
      )}
    </div>
  );
};

export default FeatureCard;
