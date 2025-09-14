import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Layout
import MainLayout from '../layouts/MainLayout';

// Pages
import Home from '../pages/Home/home';
import Doctors from '../pages/Doctors/doctors';
import HowItWorks from '../pages/HowItWorks/HowItWorks';
import Contact from '../pages/Contact/Contact';

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