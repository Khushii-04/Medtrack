import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EditMedicine = () => {
  // ✅ SOLUTION: Hooks are now correctly placed inside the component.
  const location = useLocation();
  const medicationId = location.state?.medicationId; 
  const navigate = useNavigate();
  
  const [pillName, setPillName] = useState('Aspirin');
  const [dosage, setDosage] = useState('20ml');
  const [frequency, setFrequency] = useState('2');
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday']);
  const [time, setTime] = useState('After Meal');
  const [showChat, setShowChat] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: 'Hello! How can I help you with your medication today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/medications/${medicationId}`, 
        {
          name: pillName,
          dosage,
          frequency: parseInt(frequency),
          duration: selectedDays,
          time
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setShowConfirmModal(false);
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 300);
    }catch (error) {
      // It's better to use a UI element than alert()
      console.error('Failed to update medication', error);
      setShowConfirmModal(false);
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { type: 'user', content: chatInput }]);
      setChatInput('');
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          content: "I'm here to help! This feature will be connected to an API soon." 
        }]);
      }, 1000);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const goBack = () => {
    navigate('/dashboard');
  };

  const styles = {
    body: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      margin: 0,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '20px 30px',
      marginBottom: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '40px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    backBtn: {
      padding: '14px 28px',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: '10px',
      fontSize: '20px',
      fontWeight: 500,
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    backBtnHover: {
      backgroundColor: '#e4553f',
      color: 'white',
      fontSize: '22px',
    },
    mainContent: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    editCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      padding: '50px 60px',
      maxWidth: '900px',
      width: '100%',
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '35px',
    },
    iconWrapper: {
      width: '100px',
      height: '100px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
    },
    pillIcon: {
      fontSize: '50px',
    },
    cardTitle: {
      fontSize: '42px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '10px',
    },
    cardSubtitle: {
      color: '#6b7280',
      fontSize: '22px',
    },
    editForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    formLabel: {
      fontSize: '20px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '12px',
    },
    required: {
      color: '#ef4444',
      marginLeft: '4px',
    },
    formInput: {
      padding: '18px 24px',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '20px',
      color: '#1f2937',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    formInputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    daysSelector: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '12px',
    },
    dayCheckbox: {
      display: 'flex',
      cursor: 'pointer',
    },
    dayLabel: {
      flex: 1,
      padding: '16px 12px',
      textAlign: 'center',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: 600,
      color: '#6b7280',
      transition: 'all 0.3s ease',
      userSelect: 'none',
    },
    dayLabelChecked: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderColor: 'transparent',
    },
    formActions: {
      display: 'flex',
      gap: '16px',
      marginTop: '12px',
    },
    btn: {
      flex: 1,
      padding: '20px 32px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '20px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    btnCancel: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    btnConfirm: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    },
    chatFab: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '28px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
      zIndex: 100,
    },
    chatBox: {
      position: 'fixed',
      bottom: '110px',
      right: '30px',
      width: '350px',
      height: '450px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 101,
      opacity: 0,
      visibility: 'hidden',
      transform: 'translateY(20px)',
      transition: 'all 0.3s ease',
    },
    chatBoxShow: {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)',
    },
    chatHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '18px 20px',
      borderRadius: '16px 16px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    chatBody: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    chatMessage: {
      display: 'flex',
      maxWidth: '80%',
    },
    messageContent: {
      padding: '14px 18px',
      borderRadius: '12px',
      fontSize: '16px',
      lineHeight: 1.5,
    },
    chatFooter: {
      padding: '16px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      gap: '10px',
    },
    chatInput: {
      flex: 1,
      padding: '12px 18px',
      border: '2px solid #e5e7eb',
      borderRadius: '20px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.3s ease',
    },
    modalOverlayShow: {
      opacity: 1,
      visibility: 'visible',
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '50px',
      maxWidth: '550px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    modalIcon: {
      width: '90px',
      height: '90px',
      margin: '0 auto 28px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '45px',
      color: 'white',
    },
    modalIconSuccess: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    modalTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
    },
    modalText: {
      color: '#6b7280',
      marginBottom: '36px',
      lineHeight: 1.6,
      fontSize: '20px',
    },
    modalActions: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
    },
  };

  const [backBtnHover, setBackBtnHover] = useState(false);

  return (
    <div style={styles.body}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.logo}>MEDTrack</h1>
            <button
              style={{
                ...styles.backBtn,
                ...(backBtnHover ? styles.backBtnHover : {}),
              }}
              onMouseEnter={() => setBackBtnHover(true)}
              onMouseLeave={() => setBackBtnHover(false)}
              onClick={goBack}
            >
              <b><i className="fa-solid fa-arrow-left"></i> Back to Dashboard</b>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <div style={styles.editCard}>
            <div style={styles.cardHeader}>
              <div style={styles.iconWrapper}>
                <span style={styles.pillIcon}>💊</span>
              </div>
              <h2 style={styles.cardTitle}>Edit Medication</h2>
              <p style={styles.cardSubtitle}>Update your medication details</p>
            </div>

            <div style={styles.editForm}>
              {/* Pill Name */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Pill Name
                  <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={pillName}
                  onChange={(e) => setPillName(e.target.value)}
                  placeholder="e.g., Aspirin"
                  required
                  style={styles.formInput}
                />
              </div>

              {/* Dosage */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Dosage
                  <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 20ml or 500mg"
                  required
                  style={styles.formInput}
                />
              </div>

              {/* Frequency */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Frequency (per day)
                  <span style={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="e.g., 2"
                  min="1"
                  max="10"
                  required
                  style={styles.formInput}
                />
              </div>

              {/* Medication Duration */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Medication Duration
                  <span style={styles.required}>*</span>
                </label>
                <div style={styles.daysSelector}>
                  {days.map((day, idx) => (
                    <div
                      key={day}
                      style={styles.dayCheckbox}
                      onClick={() => handleDayToggle(day)}
                    >
                      <span
                        style={{
                          ...styles.dayLabel,
                          ...(selectedDays.includes(day) ? styles.dayLabelChecked : {}),
                        }}
                      >
                        {dayLabels[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Time
                  <span style={styles.required}>*</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={styles.formInput}
                >
                  <option value="">Select time</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="After Meal">After Meal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Buttons */}
              <div style={styles.formActions}>
                <button
                  onClick={goBack}
                  style={{ ...styles.btn, ...styles.btnCancel }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  style={{ ...styles.btn, ...styles.btnConfirm }}
                >
                  Confirm Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <button
          style={styles.chatFab}
          onClick={() =>{
            setShowChat(!showChat);
            navigate('/Chatbot');
          }
        }
        >
          💬
        </button>

        {/* Confirmation Modal */}
        <div style={{ ...styles.modalOverlay, ...(showConfirmModal ? styles.modalOverlayShow : {}) }}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>✓</div>
            <h3 style={styles.modalTitle}>Confirm Changes?</h3>
            <p style={styles.modalText}>Are you sure you want to save these changes to your medication?</p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ ...styles.btn, ...styles.btnCancel, flex: '0 0 auto', minWidth: '120px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmChanges}
                style={{ ...styles.btn, ...styles.btnConfirm, flex: '0 0 auto', minWidth: '120px' }}
              >
                Yes, Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <div style={{ ...styles.modalOverlay, ...(showSuccessModal ? styles.modalOverlayShow : {}) }}>
          <div style={styles.modal}>
            <div style={{ ...styles.modalIcon, ...styles.modalIconSuccess }}>✓</div>
            <h3 style={styles.modalTitle}>Success!</h3>
            <p style={styles.modalText}>Your medication has been updated successfully.</p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={{ ...styles.btn, ...styles.btnConfirm, flex: '0 0 auto', minWidth: '120px' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMedicine;
