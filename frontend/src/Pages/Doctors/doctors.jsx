import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MotionWrapper from "../../components/MotionWrapper/MotionWrapper";
import DoctorCard from "../../components/Cards/DoctorCard";
import doctorsData from "../../data/doctors.json";
import "./Doctors.css";

const Doctors = () => {
  const { t } = useTranslation();
  const doctors = doctorsData.doctors;

  return (
    <MotionWrapper className="doctors-container" variant="container" stagger={true}>
      <div className="page-header">
        <h1 className="page-title">{t('doctors.title')}</h1>
        <p className="page-subtitle">{t('doctors.subtitle')}</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>{t('doctors.filters.specialty.label')}</label>
          <select>
            <option value="">{t('doctors.filters.specialty.all')}</option>
            <option value="general">{t('doctors.filters.specialty.general')}</option>
            <option value="cardiology">{t('doctors.filters.specialty.cardiology')}</option>
            <option value="pediatrics">{t('doctors.filters.specialty.pediatrics')}</option>
            <option value="dermatology">{t('doctors.filters.specialty.dermatology')}</option>
            <option value="mental-health">{t('doctors.filters.specialty.mentalHealth')}</option>
            <option value="orthopedics">{t('doctors.filters.specialty.orthopedics')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('doctors.filters.availability.label')}</label>
          <select>
            <option value="">{t('doctors.filters.availability.anytime')}</option>
            <option value="now">{t('doctors.filters.availability.now')}</option>
            <option value="today">{t('doctors.filters.availability.today')}</option>
            <option value="tomorrow">{t('doctors.filters.availability.tomorrow')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('doctors.filters.sortBy.label')}</label>
          <select>
            <option value="rating">{t('doctors.filters.sortBy.rating')}</option>
            <option value="experience">{t('doctors.filters.sortBy.experience')}</option>
            <option value="price-low">{t('doctors.filters.sortBy.priceLow')}</option>
            <option value="price-high">{t('doctors.filters.sortBy.priceHigh')}</option>
          </select>
        </div>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

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
