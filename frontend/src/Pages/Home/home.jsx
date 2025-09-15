import React from "react";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import FeatureCard from "../../components/Cards/FeatureCard";
import ServiceCard from "../../components/Cards/ServiceCard";
import homeData from "../../data/home.json";
import "./Home.css";

const Home = () => {
  return (
    <MotionWrapper className="home-container" variant="container" stagger={true}>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Gramin Swasthya</h1>
          <p>Quality healthcare from the comfort of your home - Rural India's Premier Telemedicine Platform</p>
          <button className="cta-button">Consult Doctor Now</button>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">🏥</div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Gramin Swasthya?</h2>
        <div className="features-grid">
          {homeData.features.map((f) => (
            <FeatureCard
              key={f.id}
              icon={f.icon}
              title={f.title}
              description={f.description}
              cta={f.cta}
              variant={f.variant}
            />
          ))}
        </div>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          {homeData.services.map((s) => (
            <ServiceCard key={s.id} title={s.title} description={s.description} />
          ))}
        </div>
      </section>
    </MotionWrapper>
  );
};

export default Home;
