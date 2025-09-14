import React from "react";

const StepCard = ({ number, icon, title, description }) => {
  return (
    <div className="step-card">
      <div className="step-number">{number}</div>
      {icon && <div className="step-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default StepCard;
