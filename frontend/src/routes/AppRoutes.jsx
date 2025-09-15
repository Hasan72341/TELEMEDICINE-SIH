import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Layout
import MainLayout from '../layouts/MainLayout';

// Pages - Existing
import Home from "../Pages/Home/Home";
import Doctors from "../Pages/Doctors/Doctors";
import Contact from "../Pages/Contact/Contact";
import HowItWorks from "../Pages/HowItWorks/HowItWorks";

// Pages - New Features
import LanguageSelect from '../Pages/LanguageSelect/LanguageSelect.jsx';
import Login from '../Pages/Login/Login.jsx';
import NewHome from '../Pages/Home/NewHome.jsx';
import SymptomChecker from '../Pages/SymptomChecker/SymptomChecker.jsx';
import AISymptomChecker from '../Pages/AISymptomChecker/AISymptomChecker.jsx';
import Consultation from '../Pages/Consultation/Consultation.jsx';
import VideoCall from '../Pages/VideoCall/VideoCall.jsx';
import ConsultationSummary from '../Pages/ConsultationSummary/ConsultationSummary.jsx';
import Shop from '../Pages/Shop/Shop.jsx';

// Components
import AuthRedirect from '../components/AuthRedirect/AuthRedirect.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Initial Setup Routes */}
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main App Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<AuthRedirect />} />
            <Route path="home" element={<NewHome />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="symptom-analysis" element={<SymptomChecker />} />
            <Route path="ai-symptoms" element={<AISymptomChecker />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="video-call" element={<VideoCall />} />
            <Route path="consultation-summary" element={<ConsultationSummary />} />
            <Route path="shop" element={<Shop />} />
            <Route path="contact" element={<Contact />} />
            <Route path="original" element={<Home />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default AppRoutes;