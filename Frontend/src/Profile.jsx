import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: '',
    emergencyContactName: ''
  });

  const [originalProfile, setOriginalProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        navigate('/signin');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data);
      setOriginalProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/signin');
      }
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      await axios.put(
        `http://localhost:8080/api/user/profile/${userId}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOriginalProfile(profile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif",
    },
    profileCard: {
      maxWidth: '900px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(135deg, rgb(10, 195, 170) 0%, rgb(18, 152, 205) 100%)',
      padding: '40px',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
    },
    avatar: {
      width: '120px',
      height: '120px',
      background: 'white',
      borderRadius: '50%',
      margin: '0 auto 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'rgb(10, 195, 170)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    },
    userName: {
      fontSize: '32px',
      fontWeight: '600',
      marginBottom: '10px',
    },
    userEmail: {
      fontSize: '16px',
      opacity: 0.9,
    },
    backBtn: {
      position: 'absolute',
      top: '20px',
      left: '20px',
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
    logoutBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    content: {
      padding: '40px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#333',
      borderBottom: '2px solid rgb(10, 195, 170)',
      paddingBottom: '10px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px',
      marginBottom: '30px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
      marginBottom: '8px',
    },
    input: {
      padding: '12px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    inputDisabled: {
      background: '#f5f5f5',
      color: '#333',
      cursor: 'not-allowed',
    },
    select: {
      padding: '12px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      background: 'white',
    },
    textarea: {
      padding: '12px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      outline: 'none',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: "'Poppins', sans-serif",
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'flex-end',
      marginTop: '30px',
    },
    button: {
      padding: '12px 30px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    editBtn: {
      background: 'rgb(10, 195, 170)',
      color: 'white',
    },
    saveBtn: {
      background: 'rgb(18, 152, 205)',
      color: 'white',
    },
    cancelBtn: {
      background: '#f5f5f5',
      color: '#333',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '18px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid rgba(255, 255, 255, 0.3)',
      borderTop: '5px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div style={styles.profileCard}>
        <div style={styles.header}>
          <button 
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            Logout
          </button>
          
          <div style={styles.avatar}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h1 style={styles.userName}>{profile.name || 'User'}</h1>
          <p style={styles.userEmail}>{profile.email}</p>
        </div>

        <div style={styles.content}>
          {/* Basic Information */}
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                style={{
                  ...styles.input,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                style={{ ...styles.input, ...styles.inputDisabled }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                style={{
                  ...styles.input,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
                style={{
                  ...styles.input,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                style={{
                  ...styles.select,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Blood Group</label>
              <select
                value={profile.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                disabled={!isEditing}
                style={{
                  ...styles.select,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Medical Information */}
          <h2 style={styles.sectionTitle}>Medical Information</h2>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Allergies</label>
              <textarea
                value={profile.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Penicillin, Peanuts"
                style={{
                  ...styles.textarea,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              />
            </div>
          </div>

          {/* Contact Information */}
          <h2 style={styles.sectionTitle}>Additional Information</h2>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="Full Address"
                style={{
                  ...styles.textarea,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Emergency Contact Name</label>
              <input
                type="text"
                value={profile.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                disabled={!isEditing}
                placeholder="Contact Person Name"
                style={{
                  ...styles.input,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Emergency Contact Number</label>
              <input
                type="tel"
                value={profile.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
                placeholder="Emergency Phone Number"
                style={{
                  ...styles.input,
                  ...(isEditing ? {} : styles.inputDisabled)
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            {!isEditing ? (
              <button
                style={{ ...styles.button, ...styles.editBtn }}
                onClick={() => setIsEditing(true)}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  style={{ ...styles.button, ...styles.cancelBtn }}
                  onClick={handleCancel}
                  onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
                  onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
                >
                  Cancel
                </button>
                <button
                  style={{ ...styles.button, ...styles.saveBtn }}
                  onClick={handleSave}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;