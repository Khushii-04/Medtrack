import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MedicineLog.css';

const MedicineLog = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: 'Hello! How can I help you with your medication today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [stats, setStats] = useState({ taken: 0, missed: 0 });

  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: [],
    time: ''
  });

  const [takeDetails, setTakeDetails] = useState({
    dosage: '',
    notes: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/signin');
        return;
      }

      const medicationsResponse = await axios.get(
        `http://localhost:8080/api/medications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const historyResponse = await axios.get(
        `http://localhost:8080/api/medications/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedications(medicationsResponse.data);
      setHistory(historyResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/signin');
      }
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/api/doses/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDayToggle = (day) => {
    if (newMedicine.duration.includes(day)) {
      setNewMedicine({
        ...newMedicine,
        duration: newMedicine.duration.filter(d => d !== day)
      });
    } else {
      setNewMedicine({
        ...newMedicine,
        duration: [...newMedicine.duration, day]
      });
    }
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.frequency || 
        newMedicine.duration.length === 0 || !newMedicine.time) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `http://localhost:8080/api/medications`,
        newMedicine,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddModal(false);
      setNewMedicine({
        name: '',
        dosage: '',
        frequency: '',
        duration: [],
        time: ''
      });
      fetchData();
      alert('Medicine added successfully!');
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine. Please try again.');
    }
  };

  const handleTakeMedicine = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `http://localhost:8080/api/medications/take`,
        {
          medicationId: selectedMedicine._id,
          medicineName: selectedMedicine.name,
          dosage: takeDetails.dosage || selectedMedicine.dosage,
          notes: takeDetails.notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowTakeModal(false);
      setSelectedMedicine(null);
      setTakeDetails({ dosage: '', notes: '' });
      fetchData();
      fetchStats();
      alert('Medicine recorded successfully!');
    } catch (error) {
      console.error('Error recording medicine:', error);
      alert('Failed to record medicine. Please try again.');
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `http://localhost:8080/api/medications/${medicineId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();
      alert('Medicine deleted successfully!');
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setChatInput('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/chat',
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: response.data.reply
      }]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: "I'm here to help! This feature will be connected to an API soon."
      }]);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'taken') {
      return <span className="status-badge taken-badge">✓ Taken</span>;
    } else if (status === 'missed') {
      return <span className="status-badge missed-badge">✗ Missed</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="medicine-log-body">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="medicine-log-container">
        {/* Header */}
        <div className="medicine-log-header">
          <div className="header-content">
            <h1 className="logo">MEDTrack</h1>
            <button
              className="back-btn"
              onClick={() => navigate('/dashboard')}
            >
              <b><i className="fa-solid fa-arrow-left"></i> Back to Dashboard</b>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="main-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Medicine Log</h2>
              <div className="stats-summary">
                <span className="stat-item taken">Taken: {stats.taken}</span>
                <span className="stat-item missed">Missed: {stats.missed}</span>
                <span className="stat-item rate">Adherence: {stats.adherenceRate || 0}%</span>
              </div>
            </div>
            <button
              className="add-button"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fa-solid fa-plus"></i> Add Medicine
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'inventory' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              Medicine Inventory
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Medicine History
            </button>
          </div>

          {/* Content */}
          <div className="content">
            {activeTab === 'inventory' ? (
              medications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💊</div>
                  <p className="empty-text">No medicines in inventory. Add your first medicine!</p>
                </div>
              ) : (
                <div className="medicine-grid">
                  {medications.map((medicine) => (
                    <div key={medicine._id} className="medicine-card">
                      <div className="medicine-icon">💊</div>
                      <h3 className="medicine-name">{medicine.name}</h3>
                      <div className="medicine-details">
                        <div className="detail-row">
                          <span className="detail-label">Dosage:</span>
                          <span className="detail-value">{medicine.dosage}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Frequency:</span>
                          <span className="detail-value">{medicine.frequency}x per day</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Time:</span>
                          <span className="detail-value">{medicine.time}</span>
                        </div>
                        {medicine.duration && medicine.duration.length > 0 && (
                          <div className="detail-row">
                            <span className="detail-label">Days:</span>
                            <span className="detail-value">{medicine.duration.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      <div className="button-group">
                        <button
                          className="take-button"
                          onClick={() => {
                            setSelectedMedicine(medicine);
                            setTakeDetails({ dosage: medicine.dosage, notes: '' });
                            setShowTakeModal(true);
                          }}
                        >
                          <i className="fa-solid fa-check"></i> Take
                        </button>
                        <button
                          className="edit-button"
                          onClick={() => navigate('/edit-medicine', { state: { medicationId: medicine._id } })}
                        >
                          <i className="fa-solid fa-edit"></i> Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteMedicine(medicine._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              history.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p className="empty-text">No medicine history yet.</p>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <div key={item._id} className={`history-item ${item.status}`}>
                      <div className={`history-icon ${item.status}`}>
                        {item.status === 'taken' ? '✓' : '✗'}
                      </div>
                      <div className="history-info">
                        <div className="history-header">
                          <h3 className="history-title">{item.medicineName}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="history-detail">
                          Dosage: <strong>{item.dosage}</strong>
                        </p>
                        {item.notes && (
                          <p className="history-notes">
                            Notes: <em>{item.notes}</em>
                          </p>
                        )}
                      </div>
                      <div className="history-date">
                        <p className="date">{formatDate(item.takenAt)}</p>
                        <p className="time">{formatTime(item.takenAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Floating Chat Button */}
        <button
          className="chat-fab"
          onClick={() => setShowChat(!showChat)}
        >
          💬
        </button>

        {/* Chat Box */}
        <div className={`chat-box ${showChat ? 'chat-box-show' : ''}`}>
          <div className="chat-header">
            <h3>Chat Assistant</h3>
            <button
              onClick={() => setShowChat(false)}
              className="chat-close-btn"
            >
              ✕
            </button>
          </div>
          <div className="chat-body">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.type === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleChatKeyPress}
              className="chat-input"
            />
            <button
              onClick={handleSendMessage}
              className="chat-send-btn"
            >
              📤
            </button>
          </div>
        </div>

        {/* Add Medicine Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">💊</div>
              <h2 className="modal-title">Add New Medicine</h2>
              
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Aspirin"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dosage *</label>
                <input
                  type="text"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                  className="form-input"
                  placeholder="e.g., 20ml or 500mg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Frequency (per day) *</label>
                <input
                  type="number"
                  value={newMedicine.frequency}
                  onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                  className="form-input"
                  placeholder="e.g., 2"
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medication Duration *</label>
                <div className="days-selector">
                  {days.map((day, idx) => (
                    <div
                      key={day}
                      className="day-checkbox"
                      onClick={() => handleDayToggle(day)}
                    >
                      <span className={`day-label ${newMedicine.duration.includes(day) ? 'day-label-checked' : ''}`}>
                        {dayLabels[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Time *</label>
                <select
                  value={newMedicine.time}
                  onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select time</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="After Meal">After Meal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  onClick={handleAddMedicine}
                >
                  Add Medicine
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Take Medicine Modal */}
        {showTakeModal && selectedMedicine && (
          <div className="modal-overlay" onClick={() => setShowTakeModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon modal-icon-success">✓</div>
              <h2 className="modal-title">Record Medicine Taken</h2>
              
              <div className="form-group">
                <label className="form-label">Medicine</label>
                <input
                  type="text"
                  value={selectedMedicine.name}
                  disabled
                  className="form-input disabled-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dosage</label>
                <input
                  type="text"
                  value={takeDetails.dosage}
                  onChange={(e) => setTakeDetails({ ...takeDetails, dosage: e.target.value })}
                  className="form-input"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  value={takeDetails.notes}
                  onChange={(e) => setTakeDetails({ ...takeDetails, notes: e.target.value })}
                  className="form-textarea"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowTakeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  onClick={handleTakeMedicine}
                >
                  Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineLog;