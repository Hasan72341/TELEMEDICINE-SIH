import React from "react";
import { useNavigate } from "react-router-dom";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import FeatureCard from "../../components/Cards/FeatureCard";
import ServiceCard from "../../components/Cards/ServiceCard";
import homeData from "../../data/home.json";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: "emergency",
      icon: "🚨",
      title: "Emergency",
      description: "Connect to emergency services",
      action: () => handleEmergency(),
      variant: "emergency"
    },
    {
      id: "health-records",
      icon: "📊",
      title: "My Health",
      description: "View your health records",
      action: () => handleHealthRecords(),
      variant: "primary"
    },
    {
      id: "prescriptions",
      icon: "📝",
      title: "Prescriptions",
      description: "View past prescriptions",
      action: () => handlePrescriptions(),
      variant: "secondary"
    }
  ];

  const handleEmergency = () => {
    // Emergency action - connect to emergency services
    const emergencyNumber = "108"; // National emergency helpline
    const confirmCall = window.confirm(
      `🚨 Emergency Alert!\n\nYou are about to call ${emergencyNumber} (National Emergency Helpline).\n\nThis will connect you to:\n• Ambulance Services\n• Medical Emergency Response\n• Fire Department\n• Police\n\nClick OK to proceed with the emergency call.`
    );
    
    if (confirmCall) {
      // In a real app, this would initiate an emergency call or connect to services
      window.open(`tel:${emergencyNumber}`, '_self');
      
      // Also show emergency information
      setTimeout(() => {
        alert(`📞 Calling ${emergencyNumber}...\n\n⚡ Quick Emergency Tips:\n• Stay calm and speak clearly\n• Provide your exact location\n• Describe the emergency situation\n• Follow dispatcher instructions\n\n🏥 Your location and medical info will be shared for faster response.`);
      }, 500);
    }
  };

  const handleHealthRecords = () => {
    // Navigate to dedicated health records page
    navigate('/health-records');
  };

  const handlePrescriptions = () => {
    // Show dummy prescriptions
    const hasPrescriptions = localStorage.getItem('userPrescriptions');
    
    if (!hasPrescriptions) {
      // Create dummy prescriptions
      const dummyPrescriptions = [
        {
          id: "RX001",
          date: "2024-09-10",
          doctor: "Dr. Rajesh Sharma",
          medicines: [
            { name: "Metformin 500mg", dosage: "Twice daily after meals", duration: "30 days" },
            { name: "Lisinopril 10mg", dosage: "Once daily morning", duration: "30 days" },
            { name: "Vitamin D3", dosage: "Once weekly", duration: "12 weeks" }
          ],
          instructions: "Follow prescribed dosage, regular monitoring required"
        },
        {
          id: "RX002",
          date: "2024-08-25",
          doctor: "Dr. Priya Gupta",
          medicines: [
            { name: "Amoxicillin 500mg", dosage: "Three times daily", duration: "7 days" },
            { name: "Paracetamol 650mg", dosage: "As needed for fever", duration: "5 days" }
          ],
          instructions: "Complete antibiotic course, rest and hydration"
        }
      ];
      
      localStorage.setItem('userPrescriptions', JSON.stringify(dummyPrescriptions));
    }
    
    const prescriptions = JSON.parse(localStorage.getItem('userPrescriptions'));
    const latestRx = prescriptions[0];
    
    alert(`📝 Recent Prescriptions\n\n🆔 ${latestRx.id} - ${latestRx.date}\n👨‍⚕️ ${latestRx.doctor}\n\n💊 Medicines:\n${latestRx.medicines.map(med => `• ${med.name}\n  ${med.dosage} - ${med.duration}`).join('\n')}\n\n📋 Instructions: ${latestRx.instructions}\n\n📊 Total Prescriptions: ${prescriptions.length}\n\n[In full app, this would open prescription management dashboard]`);
  };

  return (
    <MotionWrapper className="home-container" variant="container" stagger={true}>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Gramin Swasthya</h1>
          <p>Quality healthcare from the comfort of your home - Rural India's Premier Telemedicine Platform</p>
          <button className="cta-button" onClick={() => navigate('/consultation')}>Consult Doctor Now</button>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">🏥</div>
        </div>
      </section>

      <section className="quick-actions-section">
        <div className="section-header">
          <h2>⚡ Quick Actions</h2>
          <p>Fast access to essential health services</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className={`quick-action-card ${action.variant}`}
              onClick={action.action}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
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
