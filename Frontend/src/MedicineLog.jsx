import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MedicineLog.css';

const MedicineLog = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'history'
  const [medicines, setMedicines] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    quantity: '',
    frequency: 'Once Daily',
    instructions: '',
    expiryDate: ''
  });

  const [takeDetails, setTakeDetails] = useState({
    dosage: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/signin');
        return;
      }

      // Fetch medicines inventory
      const medicinesResponse = await axios.get(
        `http://localhost:8080/api/medicines/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch medicine history
      const historyResponse = await axios.get(
        `http://localhost:8080/api/medicines/history/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedicines(medicinesResponse.data);
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

  const handleAddMedicine = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      await axios.post(
        `http://localhost:8080/api/medicines`,
        { ...newMedicine, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddModal(false);
      setNewMedicine({
        name: '',
        dosage: '',
        quantity: '',
        frequency: 'Once Daily',
        instructions: '',
        expiryDate: ''
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
      const userId = localStorage.getItem('userId');

      await axios.post(
        `http://localhost:8080/api/medicines/take`,
        {
          userId,
          medicineId: selectedMedicine._id,
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
        `http://localhost:8080/api/medicines/${medicineId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();
      alert('Medicine deleted successfully!');
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine. Please try again.');
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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif",
    },
    card: {
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(135deg, rgb(10, 195, 170) 0%, rgb(18, 152, 205) 100%)',
      padding: '30px 40px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    backBtn: {
      position: 'absolute',
      left: '40px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    headerCenter: {
      flex: 1,
      textAlign: 'center',
    },
    title: {
      fontSize: '32px',
      fontWeight: '600',
      margin: 0,
    },
    addButton: {
      background: 'white',
      color: 'rgb(10, 195, 170)',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    tabs: {
      display: 'flex',
      borderBottom: '2px solid #e0e0e0',
    },
    tab: {
      flex: 1,
      padding: '20px',
      border: 'none',
      background: 'transparent',
      fontSize: '18px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: '#666',
    },
    tabActive: {
      color: 'rgb(10, 195, 170)',
      borderBottom: '3px solid rgb(10, 195, 170)',
    },
    content: {
      padding: '40px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    medicineCard: {
      background: '#f8f9fa',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    medicineName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
    },
    medicineDetail: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
    },
    button: {
      flex: 1,
      padding: '10px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    takeButton: {
      background: 'rgb(10, 195, 170)',
      color: 'white',
    },
    deleteButton: {
      background: '#ff4757',
      color: 'white',
    },
    historyItem: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    historyInfo: {
      flex: 1,
    },
    historyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
    },
    historyDetails: {
      fontSize: '14px',
      color: '#666',
    },
    historyDate: {
      textAlign: 'right',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      padding: '40px',
      borderRadius: '15px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '25px',
      color: '#333',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      background: 'white',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: "'Poppins', sans-serif",
    },
    modalButtons: {
      display: 'flex',
      gap: '15px',
      marginTop: '25px',
    },
    cancelButton: {
      flex: 1,
      padding: '12px',
      background: '#f5f5f5',
      color: '#333',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    submitButton: {
      flex: 1,
      padding: '12px',
      background: 'rgb(10, 195, 170)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#999',
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px',
    },
    emptyText: {
      fontSize: '18px',
    },
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderTop: '5px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div style={styles.card}>
        <div style={styles.header}>
          <button 
            style={styles.backBtn}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <span>←</span> Back
          </button>

          <div style={styles.headerCenter}>
            <h1 style={styles.title}>Medicine Log</h1>
          </div>

          <button
            style={styles.addButton}
            onClick={() => setShowAddModal(true)}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            + Add Medicine
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'inventory' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('inventory')}
          >
            Medicine Inventory
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'history' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('history')}
          >
            Medicine History
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'inventory' ? (
            medicines.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💊</div>
                <p style={styles.emptyText}>No medicines in inventory. Add your first medicine!</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {medicines.map((medicine) => (
                  <div key={medicine._id} style={styles.medicineCard}>
                    <h3 style={styles.medicineName}>{medicine.name}</h3>
                    <div style={styles.medicineDetail}>
                      <span>Dosage:</span>
                      <strong>{medicine.dosage}</strong>
                    </div>
                    <div style={styles.medicineDetail}>
                      <span>Quantity:</span>
                      <strong>{medicine.quantity}</strong>
                    </div>
                    <div style={styles.medicineDetail}>
                      <span>Frequency:</span>
                      <strong>{medicine.frequency}</strong>
                    </div>
                    {medicine.expiryDate && (
                      <div style={styles.medicineDetail}>
                        <span>Expiry:</span>
                        <strong>{formatDate(medicine.expiryDate)}</strong>
                      </div>
                    )}
                    {medicine.instructions && (
                      <div style={{ marginTop: '10px', fontSize: '13px', color: '#888' }}>
                        <em>{medicine.instructions}</em>
                      </div>
                    )}
                    <div style={styles.buttonGroup}>
                      <button
                        style={{ ...styles.button, ...styles.takeButton }}
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setTakeDetails({ dosage: medicine.dosage, notes: '' });
                          setShowTakeModal(true);
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        Take Medicine
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.deleteButton }}
                        onClick={() => handleDeleteMedicine(medicine._id)}
                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            history.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📋</div>
                <p style={styles.emptyText}>No medicine history yet.</p>
              </div>
            ) : (
              <div>
                {history.map((item) => (
                  <div key={item._id} style={styles.historyItem}>
                    <div style={styles.historyInfo}>
                      <h3 style={styles.historyTitle}>{item.medicineName}</h3>
                      <p style={styles.historyDetails}>
                        Dosage: <strong>{item.dosage}</strong>
                      </p>
                      {item.notes && (
                        <p style={styles.historyDetails}>
                          Notes: <em>{item.notes}</em>
                        </p>
                      )}
                    </div>
                    <div style={styles.historyDate}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#333' }}>
                        {formatDate(item.takenAt)}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        {formatTime(item.takenAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Add New Medicine</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Medicine Name *</label>
              <input
                type="text"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                style={styles.input}
                placeholder="e.g., Aspirin"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Dosage *</label>
              <input
                type="text"
                value={newMedicine.dosage}
                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                style={styles.input}
                placeholder="e.g., 500mg"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                value={newMedicine.quantity}
                onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })}
                style={styles.input}
                placeholder="e.g., 30"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Frequency *</label>
              <select
                value={newMedicine.frequency}
                onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                style={styles.select}
              >
                <option value="Once Daily">Once Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Three Times Daily">Three Times Daily</option>
                <option value="Four Times Daily">Four Times Daily</option>
                <option value="As Needed">As Needed</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Expiry Date</label>
              <input
                type="date"
                value={newMedicine.expiryDate}
                onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Instructions</label>
              <textarea
                value={newMedicine.instructions}
                onChange={(e) => setNewMedicine({ ...newMedicine, instructions: e.target.value })}
                style={styles.textarea}
                placeholder="e.g., Take with food"
              />
            </div>

            <div style={styles.modalButtons}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowAddModal(false)}
                onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
                onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
              >
                Cancel
              </button>
              <button
                style={styles.submitButton}
                onClick={handleAddMedicine}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Take Medicine Modal */}
      {showTakeModal && selectedMedicine && (
        <div style={styles.modal} onClick={() => setShowTakeModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Record Medicine Taken</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Medicine</label>
              <input
                type="text"
                value={selectedMedicine.name}
                disabled
                style={{ ...styles.input, background: '#f5f5f5' }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Dosage</label>
              <input
                type="text"
                value={takeDetails.dosage}
                onChange={(e) => setTakeDetails({ ...takeDetails, dosage: e.target.value })}
                style={styles.input}
                placeholder="e.g., 500mg"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Notes (Optional)</label>
              <textarea
                value={takeDetails.notes}
                onChange={(e) => setTakeDetails({ ...takeDetails, notes: e.target.value })}
                style={styles.textarea}
                placeholder="Any additional notes..."
              />
            </div>

            <div style={styles.modalButtons}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowTakeModal(false)}
                onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
                onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
              >
                Cancel
              </button>
              <button
                style={styles.submitButton}
                onClick={handleTakeMedicine}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineLog;