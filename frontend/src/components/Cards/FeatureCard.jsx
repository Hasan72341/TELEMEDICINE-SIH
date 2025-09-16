import React from "react";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ icon, title, description, cta, variant, onClick }) => {
  const navigate = useNavigate();
  const isAI = variant === "ai";
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isAI) {
      navigate('/ai-symptoms');
    } else if (variant === "doctors") {
      navigate('/doctors');
    } else if (variant === "medicine") {
      navigate('/shop');
    } else if (variant === "consultation") {
      navigate('/consultation');
    }
  };
  
  return (
    <div className={`feature-card ${isAI ? "ai-feature-card" : ""}`}>
      {icon && <div className="feature-icon">{icon}</div>}
      <h3 className="feature-title">{title}</h3>
      {description && <p className="feature-description">{description}</p>}
      {cta && (
        <button className="feature-btn" onClick={handleClick}>
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
