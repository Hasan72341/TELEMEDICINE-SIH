import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Layout
import MainLayout from '../layouts/MainLayout';

// Pages - Existing  
import Home from "../Pages/Home/home";
import Doctors from "../Pages/Doctors/doctors";
import Contact from "../Pages/Contact/contact";
import HowItWorks from "../Pages/HowItWorks/howitworks";

// Pages - New Features
import LanguageSelect from '../Pages/LanguageSelect/languageselect';
import Login from '../Pages/Login/login';
import NewHome from '../Pages/Home/newhome';
import SymptomChecker from '../Pages/SymptomChecker/symptomchecker';
import AISymptomChecker from '../Pages/AISymptomChecker/aisymptomchecker';
import Consultation from '../Pages/Consultation/consultation';
import VideoCall from '../Pages/VideoCall/videocall';
import ConsultationSummary from '../Pages/ConsultationSummary/consultationsummary';
import Shop from '../Pages/Shop/shop';

// Components
import AuthRedirect from '../components/AuthRedirect/AuthRedirect';

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