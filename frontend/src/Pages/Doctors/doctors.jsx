import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import DoctorCard from "../../components/Cards/DoctorCard";
import { useLocalizedContent, getLocalizedContent } from "../../utils/i18nUtils";
import doctorsData from "../../data/doctors.json";
import "./doctors.css";

const Doctors = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData.doctors);

  // Create specialty options from actual doctor data with localization
  const specialties = useMemo(() => {
    const uniqueSpecialties = [...new Set(
      doctorsData.doctors.map(doctor => 
        getLocalizedContent(doctor.specialization, i18n.language, doctor.specialization)
      )
    )];
    return uniqueSpecialties;
  }, [i18n.language]);

  // Filter and sort doctors
  const processedDoctors = useMemo(() => {
    let filtered = doctorsData.doctors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor => {
        const localizedName = getLocalizedContent(doctor.name, i18n.language, '');
        const localizedSpecialization = getLocalizedContent(doctor.specialization, i18n.language, '');
        const localizedQualification = getLocalizedContent(doctor.qualification, i18n.language, '');
        
        return localizedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               localizedSpecialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
               localizedQualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
               doctor.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }

    // Specialty filter
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => {
        const localizedSpecialization = getLocalizedContent(doctor.specialization, i18n.language, '');
        return localizedSpecialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
      });
    }

    // Availability filter
    if (selectedAvailability) {
      switch (selectedAvailability) {
        case "available":
          filtered = filtered.filter(doctor => doctor.available === true);
          break;
        case "busy":
          filtered = filtered.filter(doctor => doctor.available === false);
          break;
        default:
          break;
      }
    }

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          const aExp = parseInt(a.experience.match(/\d+/)[0]);
          const bExp = parseInt(b.experience.match(/\d+/)[0]);
          return bExp - aExp;
        case "price-low":
          return a.consultationFee - b.consultationFee;
        case "price-high":
          return b.consultationFee - a.consultationFee;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedSpecialty, selectedAvailability, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    setSelectedAvailability("");
    setSortBy("rating");
  };

  return (
    <MotionWrapper className="doctors-container" variant="container" stagger={true}>
      <div className="page-header">
        <h1 className="page-title">{t('doctors.title')}</h1>
        <p className="page-subtitle">{t('doctors.subtitle')}</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder={t('doctors.search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">
            🔍
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>{t('doctors.filters.specialty.label')}</label>
          <select 
            value={selectedSpecialty} 
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">{t('doctors.filters.specialty.all')}</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t('doctors.filters.availability.label')}</label>
          <select 
            value={selectedAvailability} 
            onChange={(e) => setSelectedAvailability(e.target.value)}
          >
            <option value="">{t('doctors.filters.availability.anytime')}</option>
            <option value="available">{t('doctors.filters.availability.available')}</option>
            <option value="busy">{t('doctors.filters.availability.busy')}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t('doctors.filters.sortBy.label')}</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">{t('doctors.filters.sortBy.rating')}</option>
            <option value="experience">{t('doctors.filters.sortBy.experience')}</option>
            <option value="price-low">{t('doctors.filters.sortBy.priceLow')}</option>
            <option value="price-high">{t('doctors.filters.sortBy.priceHigh')}</option>
            <option value="name">{t('doctors.filters.sortBy.name')}</option>
          </select>
        </div>

        <button className="clear-filters-btn" onClick={handleClearFilters}>
          {t('doctors.filters.clearAll')}
        </button>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>{t('doctors.results.showing')} {processedDoctors.length} {t('doctors.results.outOf')} {doctorsData.doctors.length} {t('doctors.results.doctors')}</p>
        {(searchTerm || selectedSpecialty || selectedAvailability) && (
          <div className="active-filters">
            {searchTerm && (
              <span className="filter-tag">
                {t('doctors.filters.search')}: "{searchTerm}"
                <button onClick={() => setSearchTerm("")}>×</button>
              </span>
            )}
            {selectedSpecialty && (
              <span className="filter-tag">
                {t('doctors.filters.specialty.label')}: {selectedSpecialty}
                <button onClick={() => setSelectedSpecialty("")}>×</button>
              </span>
            )}
            {selectedAvailability && (
              <span className="filter-tag">
                {t('doctors.filters.availability.label')}: {selectedAvailability}
                <button onClick={() => setSelectedAvailability("")}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Doctors Grid */}
      <div className="doctors-grid">
        {processedDoctors.length > 0 ? (
          processedDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <div className="no-results-icon">🔍</div>
              <h3>{t('doctors.noResults.title')}</h3>
              <p>{t('doctors.noResults.message')}</p>
              <button className="clear-filters-btn" onClick={handleClearFilters}>
                {t('doctors.noResults.clearFilters')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Section */}
      <div className="emergency-section">
        <div className="emergency-card">
          <h2>🚨 {t('doctors.emergency.title')}</h2>
          <p>{t('doctors.emergency.description')}</p>
          <button className="emergency-btn">{t('doctors.emergency.button')}</button>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default Doctors;
