import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContact: ''
  });

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

      const response = await axios.get(
        `http://localhost:8080/api/users/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split('T')[0] : '',
        gender: response.data.gender || '',
        address: response.data.address || '',
        bloodGroup: response.data.bloodGroup || '',
        allergies: response.data.allergies || '',
        emergencyContactName: response.data.emergencyContactName || '',
        emergencyContact: response.data.emergencyContact || ''
      });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      await axios.put(
        `http://localhost:8080/api/users/profile/${userId}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-body">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
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
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-icon-wrapper">
              <span className="profile-icon">👤</span>
            </div>
            <h2 className="profile-title">My Profile</h2>
            <p className="profile-subtitle">Manage your personal information</p>
          </div>

          <div className="profile-content">
            {/* Basic Information */}
            <div className="section">
              <h3 className="section-title">
                <i className="fa-solid fa-user"></i> Basic Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{profile.name || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <p className="form-value">{profile.email}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="form-value">{profile.phone || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  {editing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{profile.dateOfBirth || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  {editing ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="form-value">{profile.gender || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Address</label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Enter your address"
                      rows="3"
                    />
                  ) : (
                    <p className="form-value">{profile.address || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="section">
              <h3 className="section-title">
                <i className="fa-solid fa-briefcase-medical"></i> Medical Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  {editing ? (
                    <select
                      name="bloodGroup"
                      value={profile.bloodGroup}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <p className="form-value">{profile.bloodGroup || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Allergies</label>
                  {editing ? (
                    <textarea
                      name="allergies"
                      value={profile.allergies}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="List any allergies"
                      rows="3"
                    />
                  ) : (
                    <p className="form-value">{profile.allergies || 'None listed'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="section">
              <h3 className="section-title">
                <i className="fa-solid fa-phone-volume"></i> Emergency Contact
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={profile.emergencyContactName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Emergency contact name"
                    />
                  ) : (
                    <p className="form-value">{profile.emergencyContactName || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={profile.emergencyContact}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Emergency contact number"
                    />
                  ) : (
                    <p className="form-value">{profile.emergencyContact || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                    }}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-save"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-edit"
                >
                  <i className="fa-solid fa-edit"></i> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;