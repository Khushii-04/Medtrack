
import React, { useState } from 'react';
// import './index.css';

const MedicationDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMeds, setExpandedMeds] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showChat, setShowChat] = useState(false);
  
  // Sample medication data
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Aspirin",
      dosage: "20ml",
      frequency: 2,
      duration: "Monday-Thursday",
      time: "After Meal"
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1 pill",
      frequency: 1,
      duration: "Monday-Sunday",
      time: "Before Meal"
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      frequency: 3,
      duration: "Monday-Friday",
      time: "After Meal"
    }
  ]);

  // Sample chart data
  const takenPercentage = 75;
  const missedPercentage = 25;

  // Generate heatmap data for a month (30 days)
  const generateHeatmapData = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      const random = Math.random();
      let status, intensity;
      if (random < 0.7) {
        status = 'taken';
        intensity = Math.floor(Math.random() * 3) + 1;
      } else if (random < 0.85) {
        status = 'missed';
        intensity = Math.floor(Math.random() * 2) + 1;
      } else {
        status = 'none';
        intensity = 0;
      }
      days.push({ day: i, status, intensity });
    }
    return days;
  };

  const heatmapData = generateHeatmapData();

  const toggleMedExpansion = (id) => {
    setExpandedMeds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteClick = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    setMedications(medications.filter(med => med.id !== showDeleteConfirm));
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleLogout = () => {
    alert('Logging out...');
  };

  const getHeatmapColor = (status, intensity) => {
    if (status === 'taken') {
      const greenShades = ['#c6f6d5', '#68d391', '#38a169'];
      return greenShades[intensity - 1] || greenShades[0];
    } else if (status === 'missed') {
      const redShades = ['#fed7d7', '#fc8181'];
      return redShades[intensity - 1] || redShades[0];
    }
    return '#e2e8f0';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>MEDTrack</h2>
            <button onClick={() => setSidebarOpen(false)} className="close-btn">
              ✕
            </button>
          </div>
          <nav className="sidebar-nav">
            <a href="Dashboard.jsx" className="nav-item active">
              <span className="nav-icon">📊</span>
              <span><b>Dashboard</b></span>
            </a>
            <a href="#profile" className="nav-item">
              <span className="nav-icon">👤</span>
              <span><b>Profile</b></span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">📋</span>
              <span><b>Medicine Log</b></span>
            </a>
            <button onClick={handleLogout} className="nav-item logout-btn">
              <span className="nav-icon">🚪</span>
              <span>Log Out</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="menu-btn">
            ☰
          </button>
        )}
        
        <div className="content-wrapper">
          {/* Charts Section */}
          <div className="charts-section">
            <h3 className="section-title">Medication Progress</h3>
            
            <div className="charts-grid">
              {/* Progress Bar */}
              <div className="chart-container">
                <h4 className="chart-title">Overall Adherence</h4>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${takenPercentage}%` }}></div>
                  </div>
                  <span className="progress-percentage">{takenPercentage}%</span>
                </div>
                <div className="progress-legend">
                  <div className="legend-item">
                    <div className="legend-color taken"></div>
                    <span>Taken: {takenPercentage}%</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color missed"></div>
                    <span>Missed: {missedPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Heatmap */}
              <div className="chart-container">
                <h4 className="chart-title">Monthly Overview</h4>
                <div className="heatmap-grid">
                  {heatmapData.map((day) => (
                    <div
                      key={day.day}
                      className="heatmap-cell"
                      style={{ backgroundColor: getHeatmapColor(day.status, day.intensity) }}
                      title={`Day ${day.day}: ${day.status}`}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
                <div className="heatmap-legend">
                  <div className="legend-item">
                    <div className="legend-color heatmap-taken"></div>
                    <span>Taken</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color heatmap-missed"></div>
                    <span>Missed</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color heatmap-none"></div>
                    <span>None</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medications List */}
          <div className="medications-section">
            <h3 className="section-title">Your Medications</h3>
            
            {medications.map((med) => (
              <div key={med.id} className="medication-card">
                {/* Collapsed View */}
                <div className="med-header" onClick={() => toggleMedExpansion(med.id)}>
                  <div className="med-name-wrapper">
                    <span className="med-icon">💊</span>
                    <h4>{med.name}</h4>
                  </div>
                  <button className="expand-btn">
                    {expandedMeds[med.id] ? '▲' : '▼'}
                  </button>
                </div>

                {/* Expanded View */}
                {expandedMeds[med.id] && (
                  <div className="med-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <p className="detail-label">Dosage</p>
                        <p className="detail-value">{med.dosage}</p>
                      </div>
                      <div className="detail-item">
                        <p className="detail-label">Frequency (per Day)</p>
                        <p className="detail-value">{med.frequency}</p>
                      </div>
                      <div className="detail-item">
                        <p className="detail-label">Medication Duration</p>
                        <p className="detail-value">{med.duration}</p>
                      </div>
                      <div className="detail-item">
                        <p className="detail-label">Time</p>
                        <p className="detail-value">{med.time}</p>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button className="edit-btn">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteClick(med.id)} className="delete-btn">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        {/* Chat Button */}
        <button onClick={() => setShowChat(!showChat)} className="fab chat-fab">
          💬
        </button>
        
        {/* Add Medicine Button */}
        <button className="fab add-fab">
          +
        </button>
      </div>

      {/* Chat Box */}
      {showChat && (
        <div className="chat-box">
          <div className="chat-header">
            <h3>Chat Assistant</h3>
            <button onClick={() => setShowChat(false)} className="chat-close">✕</button>
          </div>
          <div className="chat-body">
            <div className="chat-placeholder">Chat functionality will be connected to API</div>
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="Type a message..." className="chat-input" />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Confirm Deletion</h3>
            <p className="modal-text">Are you sure you want to delete this medication? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationDashboard;