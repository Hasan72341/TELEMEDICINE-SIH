import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import "./NavBar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Auto-close menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🏥</span>
          <span className="logo-text">Gramin Swasthya</span>
        </Link>

        <div
          id="primary-navigation"
          className={`navbar-menu ${isMenuOpen ? "active" : ""}`}
          role="navigation"
          aria-hidden={!isMenuOpen}
        >
          <Link
            to="/"
            className={`navbar-link ${isActiveLink("/") ? "active" : ""}`}
            onClick={closeMenu}
          >
            {t('navigation.home')}
          </Link>
          <Link
            to="/doctors"
            className={`navbar-link ${isActiveLink("/doctors") ? "active" : ""}`}
            onClick={closeMenu}
          >
            {t('navigation.doctors')}
          </Link>
          <Link
            to="/how-it-works"
            className={`navbar-link ${isActiveLink("/how-it-works") ? "active" : ""}`}
            onClick={closeMenu}
          >
            {t('navigation.howItWorks')}
          </Link>
          <Link
            to="/contact"
            className={`navbar-link ${isActiveLink("/contact") ? "active" : ""}`}
            onClick={closeMenu}
          >
            {t('navigation.contact')}
          </Link>
          <LanguageSwitcher />
        </div>

        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
