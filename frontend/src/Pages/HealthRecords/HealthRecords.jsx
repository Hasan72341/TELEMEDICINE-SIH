import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper';
import './HealthRecords.css';

const HealthRecords = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    // Load or create dummy health records
    loadHealthRecords();
  }, []);

  const loadHealthRecords = () => {
    let records = localStorage.getItem('userHealthRecords');
    
    if (!records) {
      // Create comprehensive dummy health records
      const dummyHealthData = {
        personalInfo: {
          patientId: "GS2024001",
          name: "Ramesh Kumar",
          age: 45,
          gender: "Male",
          bloodGroup: "B+",
          height: "175 cm",
          weight: "78 kg",
          phone: "+91 98765 43210",
          address: "Village Khanna, Tehsil Samrala, District Ludhiana, Punjab",
          emergencyContact: "Sunita Kumar - Wife (+91 98765 43211)"
        },
        vitals: {
          lastUpdated: "2024-09-15",
          bloodPressure: "140/85 mmHg",
          heartRate: "78 bpm",
          temperature: "98.4°F",
          oxygenSaturation: "97%",
          respiratoryRate: "16/min",
          bmi: "25.4",
          glucoseLevel: "125 mg/dL"
        },
        medicalHistory: {
          chronicConditions: [
            {
              condition: "Type 2 Diabetes Mellitus",
              diagnosedDate: "2020-03-15",
              status: "Controlled",
              severity: "Moderate"
            },
            {
              condition: "Hypertension",
              diagnosedDate: "2019-08-22",
              status: "Under Treatment",
              severity: "Mild"
            }
          ],
          allergies: [
            {
              allergen: "Penicillin",
              reaction: "Skin rash, difficulty breathing",
              severity: "Severe"
            },
            {
              allergen: "Shellfish",
              reaction: "Nausea, vomiting",
              severity: "Moderate"
            }
          ],
          surgeries: [
            {
              procedure: "Appendectomy",
              date: "2015-07-12",
              hospital: "Civil Hospital Ludhiana",
              surgeon: "Dr. Amarjeet Singh"
            }
          ]
        },
        currentMedications: [
          {
            name: "Metformin HCl",
            dosage: "500mg",
            frequency: "Twice daily",
            timing: "After meals",
            prescribedBy: "Dr. Rajesh Sharma",
            startDate: "2024-08-01",
            purpose: "Blood sugar control"
          },
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            timing: "Morning",
            prescribedBy: "Dr. Rajesh Sharma",
            startDate: "2024-08-01",
            purpose: "Blood pressure control"
          },
          {
            name: "Aspirin",
            dosage: "75mg",
            frequency: "Once daily",
            timing: "After dinner",
            prescribedBy: "Dr. Rajesh Sharma",
            startDate: "2024-08-01",
            purpose: "Cardiovascular protection"
          }
        ],
        recentVisits: [
          {
            date: "2024-09-10",
            doctor: "Dr. Rajesh Sharma",
            specialty: "General Medicine",
            type: "Video Consultation",
            diagnosis: "Diabetes follow-up, Hypertension monitoring",
            treatment: "Continue current medications, lifestyle counseling",
            nextAppointment: "2024-10-10"
          },
          {
            date: "2024-08-15",
            doctor: "Dr. Priya Gupta",
            specialty: "Endocrinology",
            type: "In-person",
            diagnosis: "Diabetes management review",
            treatment: "HbA1c monitoring, dietary advice",
            nextAppointment: "2024-11-15"
          },
          {
            date: "2024-07-20",
            doctor: "Dr. Manpreet Singh",
            specialty: "Cardiology",
            type: "Video Consultation",
            diagnosis: "Hypertension assessment",
            treatment: "ECG normal, continue antihypertensive",
            nextAppointment: "2024-10-20"
          }
        ],
        labReports: [
          {
            date: "2024-09-05",
            testType: "Complete Blood Count (CBC)",
            orderedBy: "Dr. Rajesh Sharma",
            status: "Completed",
            results: {
              "Hemoglobin": "13.8 g/dL (Normal)",
              "WBC Count": "7,200/μL (Normal)",
              "Platelet Count": "285,000/μL (Normal)",
              "RBC Count": "4.6 million/μL (Normal)"
            }
          },
          {
            date: "2024-09-05",
            testType: "HbA1c (Glycated Hemoglobin)",
            orderedBy: "Dr. Rajesh Sharma",
            status: "Completed",
            results: {
              "HbA1c": "7.2% (Fair Control)",
              "Average Glucose": "160 mg/dL",
              "Target": "< 7.0%"
            }
          },
          {
            date: "2024-08-20",
            testType: "Lipid Profile",
            orderedBy: "Dr. Manpreet Singh",
            status: "Completed",
            results: {
              "Total Cholesterol": "195 mg/dL (Borderline)",
              "LDL": "118 mg/dL (Borderline)",
              "HDL": "45 mg/dL (Low)",
              "Triglycerides": "165 mg/dL (Normal)"
            }
          }
        ],
        immunizations: [
          {
            vaccine: "COVID-19 (Covishield)",
            date: "2021-06-15",
            dose: "2nd Dose",
            provider: "PHC Khanna"
          },
          {
            vaccine: "Influenza",
            date: "2023-10-01",
            dose: "Annual",
            provider: "Gramin Swasthya"
          },
          {
            vaccine: "Tetanus",
            date: "2019-03-12",
            dose: "Booster",
            provider: "Civil Hospital Ludhiana"
          }
        ]
      };
      
      localStorage.setItem('userHealthRecords', JSON.stringify(dummyHealthData));
      setHealthData(dummyHealthData);
    } else {
      setHealthData(JSON.parse(records));
    }
  };

  const getHealthStatus = () => {
    if (!healthData) return "Loading...";
    
    const conditions = healthData.medicalHistory.chronicConditions.length;
    const medications = healthData.currentMedications.length;
    
    if (conditions === 0) return "Excellent";
    if (conditions <= 2 && medications <= 3) return "Good";
    if (conditions <= 4 && medications <= 5) return "Fair";
    return "Needs Attention";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Excellent": return "#10b981";
      case "Good": return "#3b82f6";
      case "Fair": return "#f59e0b";
      case "Needs Attention": return "#ef4444";
      default: return "#6b7280";
    }
  };

  if (!healthData) {
    return (
      <div className="health-records-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading Health Records...</h2>
        </div>
      </div>
    );
  }

  return (
    <MotionWrapper className="health-records-container" variant="container">
      {/* Header */}
      <div className="health-header">
        <button onClick={() => navigate('/home')} className="back-btn">
          ← Back to Home
        </button>
        <div className="header-content">
          <h1>📊 My Health Records</h1>
          <p>Comprehensive health information and medical history</p>
        </div>
        <div className="health-status">
          <div className="status-indicator" style={{ background: getStatusColor(getHealthStatus()) }}>
            {getHealthStatus()}
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="patient-info-card">
        <div className="patient-avatar">
          {healthData.personalInfo.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="patient-details">
          <h2>{healthData.personalInfo.name}</h2>
          <div className="patient-meta">
            <span>ID: {healthData.personalInfo.patientId}</span>
            <span>Age: {healthData.personalInfo.age}</span>
            <span>Blood Group: {healthData.personalInfo.bloodGroup}</span>
          </div>
        </div>
        <div className="emergency-contact">
          <h4>Emergency Contact</h4>
          <p>{healthData.personalInfo.emergencyContact}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="health-tabs">
        {[
          { id: 'overview', label: '📋 Overview', icon: '📋' },
          { id: 'vitals', label: '💓 Vitals', icon: '💓' },
          { id: 'medications', label: '💊 Medications', icon: '💊' },
          { id: 'history', label: '🏥 Medical History', icon: '🏥' },
          { id: 'reports', label: '📄 Lab Reports', icon: '📄' },
          { id: 'visits', label: '👨‍⚕️ Recent Visits', icon: '👨‍⚕️' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`health-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card vitals-summary">
                <h3>💓 Current Vitals</h3>
                <div className="vitals-list">
                  <div className="vital-item">
                    <span>Blood Pressure:</span>
                    <span className="vital-value high">{healthData.vitals.bloodPressure}</span>
                  </div>
                  <div className="vital-item">
                    <span>Heart Rate:</span>
                    <span className="vital-value normal">{healthData.vitals.heartRate}</span>
                  </div>
                  <div className="vital-item">
                    <span>BMI:</span>
                    <span className="vital-value normal">{healthData.vitals.bmi}</span>
                  </div>
                  <div className="vital-item">
                    <span>Glucose:</span>
                    <span className="vital-value high">{healthData.vitals.glucoseLevel}</span>
                  </div>
                </div>
              </div>

              <div className="overview-card conditions-summary">
                <h3>🏥 Active Conditions</h3>
                <div className="conditions-list">
                  {healthData.medicalHistory.chronicConditions.map((condition, index) => (
                    <div key={index} className="condition-item">
                      <span className="condition-name">{condition.condition}</span>
                      <span className={`condition-status ${condition.status.toLowerCase().replace(' ', '-')}`}>
                        {condition.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card medications-summary">
                <h3>💊 Current Medications</h3>
                <div className="medications-count">
                  <span className="med-count">{healthData.currentMedications.length}</span>
                  <span>Active Prescriptions</span>
                </div>
                <div className="recent-meds">
                  {healthData.currentMedications.slice(0, 3).map((med, index) => (
                    <div key={index} className="med-item">
                      {med.name} {med.dosage} - {med.frequency}
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card appointments-summary">
                <h3>📅 Recent Activity</h3>
                <div className="recent-visit">
                  <div className="visit-date">{healthData.recentVisits[0].date}</div>
                  <div className="visit-doctor">{healthData.recentVisits[0].doctor}</div>
                  <div className="visit-type">{healthData.recentVisits[0].type}</div>
                </div>
                <div className="next-appointment">
                  <strong>Next: {healthData.recentVisits[0].nextAppointment}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="vitals-section">
            <div className="vitals-header">
              <h3>💓 Vital Signs</h3>
              <p>Last updated: {healthData.vitals.lastUpdated}</p>
            </div>
            <div className="vitals-grid">
              {Object.entries(healthData.vitals).map(([key, value]) => {
                if (key === 'lastUpdated') return null;
                return (
                  <div key={key} className="vital-card">
                    <div className="vital-name">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                    <div className="vital-value">{value}</div>
                    <div className="vital-trend">
                      {key === 'bloodPressure' && <span className="trend-up">↗️ Elevated</span>}
                      {key === 'heartRate' && <span className="trend-normal">➡️ Normal</span>}
                      {key === 'glucoseLevel' && <span className="trend-up">↗️ High</span>}
                      {!['bloodPressure', 'heartRate', 'glucoseLevel'].includes(key) && <span className="trend-normal">➡️ Normal</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="medications-section">
            <div className="medications-header">
              <h3>💊 Current Medications</h3>
              <p>{healthData.currentMedications.length} active prescriptions</p>
            </div>
            <div className="medications-list">
              {healthData.currentMedications.map((med, index) => (
                <div key={index} className="medication-card">
                  <div className="med-header">
                    <h4>{med.name} {med.dosage}</h4>
                    <span className="med-purpose">{med.purpose}</span>
                  </div>
                  <div className="med-details">
                    <div className="med-schedule">
                      <span>📅 {med.frequency}</span>
                      <span>⏰ {med.timing}</span>
                    </div>
                    <div className="med-prescriber">
                      <span>👨‍⚕️ Prescribed by: {med.prescribedBy}</span>
                      <span>📅 Started: {med.startDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-category">
              <h3>🏥 Chronic Conditions</h3>
              <div className="conditions-grid">
                {healthData.medicalHistory.chronicConditions.map((condition, index) => (
                  <div key={index} className="condition-card">
                    <div className="condition-header">
                      <h4>{condition.condition}</h4>
                      <span className={`severity ${condition.severity.toLowerCase()}`}>
                        {condition.severity}
                      </span>
                    </div>
                    <div className="condition-details">
                      <p>Diagnosed: {condition.diagnosedDate}</p>
                      <p>Status: {condition.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="history-category">
              <h3>⚠️ Allergies</h3>
              <div className="allergies-list">
                {healthData.medicalHistory.allergies.map((allergy, index) => (
                  <div key={index} className="allergy-card">
                    <div className="allergy-header">
                      <h4>{allergy.allergen}</h4>
                      <span className={`severity ${allergy.severity.toLowerCase()}`}>
                        {allergy.severity}
                      </span>
                    </div>
                    <p>Reaction: {allergy.reaction}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="history-category">
              <h3>🔪 Surgical History</h3>
              <div className="surgeries-list">
                {healthData.medicalHistory.surgeries.map((surgery, index) => (
                  <div key={index} className="surgery-card">
                    <h4>{surgery.procedure}</h4>
                    <div className="surgery-details">
                      <p>Date: {surgery.date}</p>
                      <p>Hospital: {surgery.hospital}</p>
                      <p>Surgeon: {surgery.surgeon}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <div className="reports-header">
              <h3>📄 Laboratory Reports</h3>
              <p>{healthData.labReports.length} recent reports</p>
            </div>
            <div className="reports-list">
              {healthData.labReports.map((report, index) => (
                <div key={index} className="report-card">
                  <div className="report-header">
                    <h4>{report.testType}</h4>
                    <div className="report-meta">
                      <span>📅 {report.date}</span>
                      <span className={`status ${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <div className="report-details">
                    <p>Ordered by: {report.orderedBy}</p>
                    <div className="test-results">
                      {Object.entries(report.results).map(([test, result]) => (
                        <div key={test} className="result-item">
                          <span className="test-name">{test}:</span>
                          <span className="test-result">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'visits' && (
          <div className="visits-section">
            <div className="visits-header">
              <h3>👨‍⚕️ Recent Visits</h3>
              <p>{healthData.recentVisits.length} consultations in the last 3 months</p>
            </div>
            <div className="visits-timeline">
              {healthData.recentVisits.map((visit, index) => (
                <div key={index} className="visit-card">
                  <div className="visit-date-badge">
                    {visit.date}
                  </div>
                  <div className="visit-content">
                    <div className="visit-header">
                      <h4>{visit.doctor}</h4>
                      <span className="visit-specialty">{visit.specialty}</span>
                      <span className={`visit-type ${visit.type.toLowerCase().replace(' ', '-')}`}>
                        {visit.type}
                      </span>
                    </div>
                    <div className="visit-details">
                      <div className="diagnosis">
                        <strong>Diagnosis:</strong> {visit.diagnosis}
                      </div>
                      <div className="treatment">
                        <strong>Treatment:</strong> {visit.treatment}
                      </div>
                      <div className="next-appointment">
                        <strong>Next Appointment:</strong> {visit.nextAppointment}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MotionWrapper>
  );
};

export default HealthRecords;