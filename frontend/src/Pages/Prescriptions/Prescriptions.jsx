import React, { useState, useEffect } from 'react';
import './Prescriptions.css';
import MotionWrapper from '../../components/MotionWrapper/MotionWrapper.jsx';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [reorderReminder, setReorderReminder] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = () => {
    let storedPrescriptions = localStorage.getItem('userPrescriptions');
    
    if (!storedPrescriptions) {
      const dummyPrescriptions = [
        {
          id: "RX001",
          date: "2024-09-10",
          doctor: "Dr. Rajesh Sharma",
          specialty: "Endocrinologist",
          status: "Active",
          medicines: [
            { 
              name: "Metformin 500mg", 
              dosage: "Twice daily after meals", 
              duration: "30 days",
              remaining: 15,
              total: 60,
              instructions: "Take with food to reduce stomach upset"
            },
            { 
              name: "Lisinopril 10mg", 
              dosage: "Once daily morning", 
              duration: "30 days",
              remaining: 20,
              total: 30,
              instructions: "Take at the same time daily"
            },
            { 
              name: "Vitamin D3 2000IU", 
              dosage: "Once weekly", 
              duration: "12 weeks",
              remaining: 8,
              total: 12,
              instructions: "Take with a meal containing fat"
            }
          ],
          instructions: "Follow prescribed dosage, regular monitoring required. Next appointment in 2 weeks.",
          diagnosis: "Type 2 Diabetes, Hypertension",
          nextRefill: "2024-09-25"
        },
        {
          id: "RX002",
          date: "2024-08-25",
          doctor: "Dr. Priya Gupta",
          specialty: "General Physician",
          status: "Completed",
          medicines: [
            { 
              name: "Amoxicillin 500mg", 
              dosage: "Three times daily", 
              duration: "7 days",
              remaining: 0,
              total: 21,
              instructions: "Take exactly as prescribed, complete full course"
            },
            { 
              name: "Paracetamol 650mg", 
              dosage: "As needed for fever", 
              duration: "5 days",
              remaining: 3,
              total: 10,
              instructions: "Maximum 4 doses per day, 6 hours apart"
            }
          ],
          instructions: "Complete antibiotic course, rest and hydration. Return if symptoms persist.",
          diagnosis: "Bacterial Infection, Fever",
          nextRefill: null
        },
        {
          id: "RX003",
          date: "2024-07-15",
          doctor: "Dr. Amit Kumar",
          specialty: "Cardiologist",
          status: "Completed",
          medicines: [
            { 
              name: "Atorvastatin 20mg", 
              dosage: "Once daily at bedtime", 
              duration: "90 days",
              remaining: 0,
              total: 90,
              instructions: "Take at same time daily, avoid grapefruit"
            },
            { 
              name: "Aspirin 75mg", 
              dosage: "Once daily after breakfast", 
              duration: "Ongoing",
              remaining: 25,
              total: 100,
              instructions: "Take with food to prevent stomach irritation"
            }
          ],
          instructions: "Cholesterol management therapy. Regular lipid profile monitoring required.",
          diagnosis: "Hyperlipidemia, Cardiovascular Risk",
          nextRefill: "2024-10-15"
        }
      ];
      
      localStorage.setItem('userPrescriptions', JSON.stringify(dummyPrescriptions));
      setPrescriptions(dummyPrescriptions);
    } else {
      setPrescriptions(JSON.parse(storedPrescriptions));
    }
  };

  const handleReorderMedicine = (medicine) => {
    setReorderReminder({
      medicine: medicine.name,
      message: `Reorder reminder set for ${medicine.name}. You'll be notified when it's time to refill.`
    });
    setTimeout(() => setReorderReminder(null), 3000);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'status-active',
      'Completed': 'status-completed',
      'Expired': 'status-expired'
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  const getMedicineStatusClass = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) return 'medicine-low';
    if (percentage <= 50) return 'medicine-medium';
    return 'medicine-good';
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (activeTab === 'current') return prescription.status === 'Active';
    if (activeTab === 'completed') return prescription.status === 'Completed';
    return true;
  });

  return (
    <MotionWrapper>
      <div className="prescriptions-container">
        <div className="prescriptions-header">
          <h1>📋 My Prescriptions</h1>
          <p>Manage your medications and prescriptions</p>
        </div>

        {reorderReminder && (
          <div className="reorder-notification">
            <span>✅ {reorderReminder.message}</span>
          </div>
        )}

        <div className="prescriptions-tabs">
          <button 
            className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Prescriptions
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Prescriptions
          </button>
        </div>

        <div className="prescriptions-content">
          <div className="prescriptions-grid">
            {filteredPrescriptions.map((prescription) => (
              <div 
                key={prescription.id}
                className={`prescription-card ${selectedPrescription?.id === prescription.id ? 'selected' : ''}`}
                onClick={() => setSelectedPrescription(prescription)}
              >
                <div className="prescription-header">
                  <div className="prescription-id">
                    <strong>📝 {prescription.id}</strong>
                    {getStatusBadge(prescription.status)}
                  </div>
                  <div className="prescription-date">{prescription.date}</div>
                </div>

                <div className="prescription-doctor">
                  <strong>👨‍⚕️ {prescription.doctor}</strong>
                  <span className="specialty">{prescription.specialty}</span>
                </div>

                <div className="prescription-diagnosis">
                  <strong>🏥 Diagnosis:</strong> {prescription.diagnosis}
                </div>

                <div className="prescription-medicines">
                  <strong>💊 Medicines ({prescription.medicines.length}):</strong>
                  <div className="medicines-list">
                    {prescription.medicines.slice(0, 2).map((medicine, index) => (
                      <div key={index} className="medicine-preview">
                        <span className="medicine-name">{medicine.name}</span>
                        <span className={`medicine-status ${getMedicineStatusClass(medicine.remaining, medicine.total)}`}>
                          {medicine.remaining}/{medicine.total} remaining
                        </span>
                      </div>
                    ))}
                    {prescription.medicines.length > 2 && (
                      <span className="more-medicines">+{prescription.medicines.length - 2} more</span>
                    )}
                  </div>
                </div>

                {prescription.nextRefill && (
                  <div className="next-refill">
                    <strong>🔄 Next Refill:</strong> {prescription.nextRefill}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedPrescription && (
            <div className="prescription-details">
              <div className="details-header">
                <h3>📋 Prescription Details - {selectedPrescription.id}</h3>
                <button 
                  className="close-details"
                  onClick={() => setSelectedPrescription(null)}
                >
                  ✕
                </button>
              </div>

              <div className="details-content">
                <div className="detail-section">
                  <h4>👨‍⚕️ Doctor Information</h4>
                  <p><strong>Name:</strong> {selectedPrescription.doctor}</p>
                  <p><strong>Specialty:</strong> {selectedPrescription.specialty}</p>
                  <p><strong>Date Prescribed:</strong> {selectedPrescription.date}</p>
                </div>

                <div className="detail-section">
                  <h4>🏥 Medical Information</h4>
                  <p><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</p>
                  <p><strong>Status:</strong> {selectedPrescription.status}</p>
                  {selectedPrescription.nextRefill && (
                    <p><strong>Next Refill Due:</strong> {selectedPrescription.nextRefill}</p>
                  )}
                </div>

                <div className="detail-section">
                  <h4>💊 Medications</h4>
                  <div className="detailed-medicines">
                    {selectedPrescription.medicines.map((medicine, index) => (
                      <div key={index} className="detailed-medicine">
                        <div className="medicine-header">
                          <strong>{medicine.name}</strong>
                          <div className={`stock-indicator ${getMedicineStatusClass(medicine.remaining, medicine.total)}`}>
                            {medicine.remaining}/{medicine.total}
                          </div>
                        </div>
                        <p><strong>Dosage:</strong> {medicine.dosage}</p>
                        <p><strong>Duration:</strong> {medicine.duration}</p>
                        <p><strong>Instructions:</strong> {medicine.instructions}</p>
                        {medicine.remaining <= medicine.total * 0.2 && medicine.remaining > 0 && (
                          <button 
                            className="reorder-button"
                            onClick={() => handleReorderMedicine(medicine)}
                          >
                            🔄 Set Reorder Reminder
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>📋 General Instructions</h4>
                  <p>{selectedPrescription.instructions}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="no-prescriptions">
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>No prescriptions found</h3>
              <p>You don't have any {activeTab === 'all' ? '' : activeTab} prescriptions at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </MotionWrapper>
  );
};

export default Prescriptions;