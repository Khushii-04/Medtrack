import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MedicationDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMeds, setExpandedMeds] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [username] = useState("Guest"); // You can replace this with actual username
  const [loading, setLoading] = useState(true);

  const PORT = process.env.PORT || 5000;
  // Fetch medications on component mount 
  // Check Once from here to
  useEffect(() => {
    fetchMedications();
  }, []);
  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/medications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medications:', error);
      alert('Failed to load medications');
      setLoading(false);
    }
  };
  // here , like i think i'm still taking the sample data right , in the next step.
  // Sample medication data
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Aspirin",
      dosage: "20ml",
      frequency: 2,
      duration: "Monday-Thursday",
      time: "After Meal",
      status: null // null, 'taken', or 'missed'
    },
    {
      id: 2,
      name: "Vitamin D",
      dosage: "1 pill",
      frequency: 1,
      duration: "Monday-Sunday",
      time: "Before Meal",
      status: null
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      frequency: 3,
      duration: "Monday-Friday",
      time: "After Meal",
      status: null
    }
  ]);

  // Sample chart data
  const takenPercentage = 80;
  const missedPercentage = 20;

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

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/medications/${showDeleteConfirm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMedications(medications.filter(med => med.id !== showDeleteConfirm));
    setShowDeleteConfirm(null);
    } catch (error) {
      alert('Failed to delete medication');
      setShowDeleteConfirm(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const handleMarkStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/medications/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    
      setMedications(medications.map(med => 
        med.id === id ? { ...med, status } : med
      ));
    } catch (error) {
      alert('Failed to update status');
    }
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
    <div className={`dashboard-container ${darkTheme ? 'dark-theme' : ''}`}>
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
            <button onClick={() => navigate('/dashboard')} className="nav-item active">
              <span className="nav-icon">📊</span>
              <span><b>Dashboard</b></span>
            </button>
            <button onClick={() => navigate('/profile')} className="nav-item">
              <span className="nav-icon">👤</span>
              <span><b>Profile</b></span>
            </button>
            <button onClick={() => navigate('/medicine-log')} className="nav-item">
              <span className="nav-icon">📋</span>
              <span><b>Medicine Log</b></span>
            </button>
            <button onClick={toggleTheme} className="nav-item theme-btn">
              <span className="nav-icon">{darkTheme ? '☀️' : '🌙'}</span>
              <span><b>{darkTheme ? 'Light Mode' : 'Dark Mode'}</b></span>
            </button>
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
          {/* Welcome Message */}
          <div className="welcome-section">
            <h2 className="welcome-message">Hi! {username}</h2>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <h3 className="section-title">Medication Progress</h3>
            
            <div className="charts-grid">
              {/* Circular Progress */}
              <div className="chart-container">
                <h4 className="chart-title">Overall Adherence</h4>
                <div className="circular-progress-wrapper">
                  <svg className="circular-progress" viewBox="0 0 200 200">
                    <circle
                      className="progress-bg"
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#f44848ff"
                      strokeWidth="20"
                    />
                    <circle
                      className="progress-circle"
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray={`${2 * Math.PI * 80 * ((takenPercentage+25) / 100)} ${2 * Math.PI * 80}`}
                      strokeDashoffset={2 * Math.PI * 80 * 0.25}
                      transform="rotate(-90 100 100)"
                    />
                    <text
                      x="100"
                      y="100"
                      textAnchor="middle"
                      dy="0.3em"
                      className="progress-text"
                    >
                      {takenPercentage}%
                    </text>
                  </svg>
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
                    {med.status && (
                      <span className={`status-badge ${med.status}`}>
                        {med.status === 'taken' ? '✓ Taken' : '✗ Missed'}
                      </span>
                    )}
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
                    
                    {/* Mark Status */}
                    <div className="mark-status">
                      <p className="detail-label">Mark as:</p>
                      <div className="status-buttons">
                        <button 
                          onClick={() => handleMarkStatus(med.id, 'taken')} 
                          className={`status-btn taken-btn ${med.status === 'taken' ? 'active' : ''}`}
                        >
                          ✓ Taken
                        </button>
                        <button 
                          onClick={() => handleMarkStatus(med.id, 'missed')} 
                          className={`status-btn missed-btn ${med.status === 'missed' ? 'active' : ''}`}
                        >
                          ✗ Missed
                        </button>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button onClick={() => navigate('/edit-medicine', { state: { medicationId: med.id } })} className="edit-btn">
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
        <button 
        onClick={() => navigate('/add-medicine')}
        className="fab add-fab">
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