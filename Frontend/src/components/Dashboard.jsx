import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MonthlyAdherenceHeatmap from './MonthlyAdherenceHeatmap';
import axios from 'axios';

const MedicationDashboard = () => {
  const navigate = useNavigate();
  
  const [medications, setMedications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMeds, setExpandedMeds] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [username, setUsername] = useState("Guest");
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: 'Hello! How can I help you with your medication today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [adherenceStats, setAdherenceStats] = useState({ taken: 0, missed: 0 });

  useEffect(() => {
    fetchUserData();
    fetchMedications();
    fetchAdherenceStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsername(response.data.name);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/medications', {
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

  const fetchAdherenceStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/doses/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdherenceStats(response.data);
    } catch (error) {
      console.error('Error fetching adherence stats:', error);
    }
  };

  const takenPercentage = adherenceStats.adherenceRate || 0;
  const missedPercentage = 100 - takenPercentage;

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
      await axios.delete(`http://localhost:8080/api/medications/${showDeleteConfirm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMedications(medications.filter(med => med._id !== showDeleteConfirm));
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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/signin');
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const handleMarkStatus = async (id, status, day) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/doses/log', 
        { 
          medicationId: id,
          status,
          scheduledTime: new Date(),
          day
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    
      setMedications(medications.map(med => 
        med._id === id ? { ...med, status } : med
      ));
      
      fetchAdherenceStats();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleSendMessage = async () => {
  if (!chatInput.trim()) return;

  const userMessage = chatInput;
  setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
  setChatInput('');

  // Add typing indicator
  setChatMessages(prev => [...prev, { type: 'bot', content: '...' }]);

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:8080/api/chat', 
      { message: userMessage },
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    // Remove typing indicator and add actual response
    setChatMessages(prev => {
      const messages = prev.slice(0, -1);
      return [...messages, { 
        type: 'bot', 
        content: response.data.reply 
      }];
    });
  } catch (error) {
    console.error('Chat error:', error);
    
    // Remove typing indicator
    setChatMessages(prev => {
      const messages = prev.slice(0, -1);
      
      let errorMessage = "I'm having trouble connecting right now. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please try logging in again.";
      } else if (error.response?.status === 429) {
        errorMessage = "⚠️ Rate limit reached. Please wait a moment and try again.";
      } else if (error.response?.data?.reply) {
        errorMessage = error.response.data.reply;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to the server. Please check if the backend is running.";
      }
      
      return [...messages, { 
        type: 'bot', 
        content: errorMessage
      }];
    });
  }
};

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading your dashboard...</div>;
  }

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
            <button onClick={() => navigate('/log')} className="nav-item">
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
          strokeDasharray={`${2 * Math.PI * 80 * ((takenPercentage) / 100)} ${2 * Math.PI * 80}`}
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
  <MonthlyAdherenceHeatmap />
</div>
          </div>
          

          {/* Medications List */}
          <div className="medications-section">
            <h3 className="section-title">Your Medications</h3>
            
            {medications.map((med) => (
              <div key={med._id} className="medication-card">
                <div className="med-header" onClick={() => toggleMedExpansion(med._id)}>
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
                    {expandedMeds[med._id] ? '▲' : '▼'}
                  </button>
                </div>

                {expandedMeds[med._id] && (
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
                        <p className="detail-value">{med.duration.join(', ')}</p>
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
                          onClick={() => handleMarkStatus(med._id, 'taken')} 
                          className={`status-btn taken-btn ${med.status === 'taken' ? 'active' : ''}`}
                        >
                          ✓ Taken
                        </button>
                        <button 
                          onClick={() => handleMarkStatus(med._id, 'missed')} 
                          className={`status-btn missed-btn ${med.status === 'missed' ? 'active' : ''}`}
                        >
                          ✗ Missed
                        </button>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button onClick={() => navigate('/edit-medicine', { state: { medicationId: med._id } })} className="edit-btn">
                          ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteClick(med._id)} className="delete-btn">
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
        <button onClick={() => setShowChat(!showChat)} className="fab chat-fab" title="Chat Assistant">
          💬
        </button>
        
        <button 
          onClick={() => navigate('/add')} 
          className="fab add-fab"
          title="Add Medicine"
        >
          +
        </button>
      </div>

      {/* Chat Box */}
      {showChat && (
        <div className="chat-box show">
          <div className="chat-header">
            <h3>Chat Assistant</h3>
            <button onClick={() => setShowChat(false)} className="chat-close">✕</button>
          </div>
          <div className="chat-body">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.type === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleChatKeyPress}
            />
            <button onClick={handleSendMessage} className="chat-send-btn">
              📤
            </button>
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

      <style jsx>{`
        .floating-buttons {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 100;
        }

        .fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fab:hover {
          transform: scale(1.1);
        }

        .chat-fab {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .add-fab {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: 36px;
          font-weight: bold;
        }

        .chat-box {
          position: fixed;
          bottom: 110px;
          right: 30px;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 101;
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .chat-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-message {
          display: flex;
          max-width: 80%;
        }

        .bot-message {
          align-self: flex-start;
        }

        .user-message {
          align-self: flex-end;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
        }

        .bot-message .message-bubble {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .user-message .message-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chat-footer {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 10px;
          background: white;
        }

        .chat-input {
          flex: 1;
          padding: 12px 18px;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .chat-input:focus {
          border-color: #667eea;
        }

        .chat-send-btn {
          padding: 10px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 20px;
          font-size: 18px;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
        }

        .chat-send-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default MedicationDashboard;