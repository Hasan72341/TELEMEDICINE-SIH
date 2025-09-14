import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Layout
import MainLayout from '../layouts/MainLayout';

// Pages
import Home from '../Pages/Home/home.jsx';
import Doctors from '../Pages/Doctors/doctors.jsx';
import HowItWorks from '../Pages/HowItWorks/howitworks.jsx';
import Contact from '../Pages/Contact/contact.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default AppRoutes;