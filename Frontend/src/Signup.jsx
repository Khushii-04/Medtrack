import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import signinBg from './assets/images/background.jpg'
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!agreeTerms) {
      alert('Please agree to terms and conditions');
      return;
    } 

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        name,
        email,
        phone,
        password
      });
    
    // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
    
    // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigation = (item) => {
    if (item === 'Home') navigate('/home');
    if (item === 'About') navigate('/about');
    if (item === 'Services') navigate('/home#features');
    if (item === 'Contact') navigate('/home#contact');
    closeSidebar();
  };
  
  const styles = {
    body: {
      backgroundColor: '#65ABDD',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif",
      margin: 0,
      padding: 0,
    },
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '25px 12.5%',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
    },
    navbar: {
      display: 'flex',
      gap: '30px',
    },
    navLink: {
      position: 'relative',
      color: 'white',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: 500,
      cursor: 'pointer',
    },
    searchBar: {
      width: '250px',
      height: '45px',
      background: 'transparent',
      border: '2px solid white',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    },
    searchInput: {
      width: '100%',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: '16px',
      color: 'white',
      padding: '10px',
    },
    searchButton: {
      width: '40px',
      height: '100%',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
    },
    background: {
      width: '100%',
      minHeight: '100vh',
      height: 'auto',
      backgroundImage: `url(${signinBg}), linear-gradient(135deg, rgba(101, 171, 221, 0.9), rgba(101, 171, 221, 0.7))`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '75%',
      minHeight: '600px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      borderRadius: '10px',
      marginTop: '20px',
      display: 'flex',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
    },
    content: {
      flex: 1,
      background: 'transparent',
      padding: '80px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      lineHeight: 1,
    },
    logo: {
      fontSize: '30px',
      fontWeight: 600,
    },
    mainHeading: {
      fontSize: '40px',
      fontWeight: 600,
      marginBottom: '10px',
    },
    subHeading: {
      fontSize: '25px',
      fontWeight: 500,
    },
    description: {
      fontSize: '16px',
      margin: '20px 0',
      lineHeight: '1.6',
    },
    socialIcons: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
    },
    socialIcon: {
      fontSize: '22px',
      color: 'black',
      cursor: 'pointer',
      transition: 'transform 0.5s ease',
      display: 'inline-block',
    },
    logregBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      background: 'transparent',
      backdropFilter: 'blur(20px)',
      borderTopRightRadius: '10px',
      borderBottomRightRadius: '10px',
      color: 'black',
      padding: '20px',
    },
    formBox: {
      width: '100%',
      maxWidth: '380px',
    },
    formHeading: {
      fontSize: '32px',
      textAlign: 'center',
      fontWeight: 600,
      marginBottom: '30px',
    },
    inputBox: {
      position: 'relative',
      width: '100%',
      height: '50px',
      borderBottom: '2px solid black',
      marginBottom: '30px',
    },
    input: {
      width: '100%',
      height: '100%',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: '16px',
      color: 'black',
      fontWeight: 500,
      paddingRight: '30px',
    },
    label: {
      position: 'absolute',
      top: '50%',
      left: 0,
      transform: 'translateY(-50%)',
      fontSize: '16px',
      fontWeight: 500,
      pointerEvents: 'none',
      transition: '0.5s ease',
      color: 'rgba(0, 0, 0, 0.6)',
    },
    labelFocused: {
      top: '-5px',
      fontSize: '12px',
      color: 'black',
      transform: 'translateY(0)',
    },
    icon: {
      position: 'absolute',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      fontSize: '19px',
      color: 'black',
    },
    rememberForgot: {
      fontSize: '14.5px',
      fontWeight: 500,
      margin: '-15px 0 15px',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    checkbox: {
      accentColor: 'rgb(18, 152, 205)',
      marginRight: '3px',
      width: '16px',
      height: '16px',
      cursor: 'pointer',
    },
    link: {
      color: 'black',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    btn: {
      width: '100%',
      height: '45px',
      background: 'rgb(10, 195, 170)',
      border: 'none',
      outline: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 500,
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 0 10px rgba(10, 195, 170, 0.5)',
      transition: '0.5s ease',
    },
    loginLink: {
      fontSize: '14.5px',
      fontWeight: 500,
      textAlign: 'center',
      marginTop: '25px',
    },
    registerLink: {
      fontSize: '18px' ,
      color: 'rgba(84, 20, 188, 1)',
      textDecoration: 'none',
      fontWeight: 600,
      cursor: 'pointer',
    },
    // Hamburger menu styles
    hamburger: {
      display: 'none',
      flexDirection: 'column',
      gap: '5px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: '5px',
      zIndex: 101,
    },
    hamburgerLine: {
      width: '28px',
      height: '3px',
      background: 'white',
      borderRadius: '3px',
      transition: 'all 0.3s ease',
    },
    // Mobile sidebar styles
    mobileSidebar: {
      position: 'fixed',
      top: 0,
      left: sidebarOpen ? 0 : '-100%',
      width: '75%',
      maxWidth: '300px',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '2px 0 15px rgba(0, 0, 0, 0.3)',
      transition: 'left 0.3s ease',
      zIndex: 999,
      padding: '80px 0 30px',
      overflowY: 'auto',
    },
    sidebarLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
    },
    sidebarLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '18px',
      fontWeight: 500,
      padding: '18px 30px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    sidebarOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      opacity: sidebarOpen ? 1 : 0,
      visibility: sidebarOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 998,
    },
  };

  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [hoveredSidebarLink, setHoveredSidebarLink] = useState(null);
  const [nameFocused, setnameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <div style={styles.body}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Sidebar Overlay */}
      <div 
        style={styles.sidebarOverlay} 
        onClick={closeSidebar}
        className="sidebar-overlay"
      ></div>

      {/* Mobile Sidebar */}
      <div style={styles.mobileSidebar} className="mobile-sidebar">
        <div style={styles.sidebarLinks}>
          {['Home', 'About', 'Services', 'Contact'].map((item, idx) => (
            <div
              key={idx}
              style={{
                ...styles.sidebarLink,
                background: hoveredSidebarLink === idx ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              }}
              onMouseEnter={() => setHoveredSidebarLink(idx)}
              onMouseLeave={() => setHoveredSidebarLink(null)}
              onClick={() => handleNavigation(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header style={styles.header} className="signup-header">
        {/* Hamburger Menu */}
        <button 
          style={styles.hamburger} 
          className="hamburger-menu"
          onClick={toggleSidebar}
        >
          <span style={{
            ...styles.hamburgerLine,
            transform: sidebarOpen ? 'rotate(45deg) translate(8px, 8px)' : 'none',
          }}></span>
          <span style={{
            ...styles.hamburgerLine,
            opacity: sidebarOpen ? 0 : 1,
          }}></span>
          <span style={{
            ...styles.hamburgerLine,
            transform: sidebarOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none',
          }}></span>
        </button>

        <nav style={styles.navbar} className="signup-navbar">
          {['Home', 'About', 'Services', 'Contact'].map((item, idx) => (
            <a
              key={idx}
              style={{
                ...styles.navLink,
                borderBottom: hoveredLink === idx ? '2px solid white' : 'none',
                paddingBottom: hoveredLink === idx ? '6px' : '0',
              }}
              onMouseEnter={() => setHoveredLink(idx)}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => handleNavigation(item)}
            >
              {item}
            </a>
          ))}
        </nav>
        
        <div style={styles.searchBar} className="signup-search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              ...styles.searchInput,
              '::placeholder': { color: 'white' }
            }}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: 'white', fontSize: '22px' }}></i>
          </button>
        </div>
      </header>

      {/* Background */}
      <div style={styles.background}></div>

      {/* Container */}
      <div style={styles.container} className="signup-container">
        <div style={styles.content} className="signup-content">
          <h2 style={styles.logo}>Doodle Developers</h2>
          
          <div style={{ marginTop: '20px' }}>
            <h2 style={styles.mainHeading}>
              Welcome! <br />
              <span style={styles.subHeading}>To Our Website.</span>
            </h2>
            
            <p style={styles.description}>
              MedTrack is your smart health companion, sending timely reminders so you never miss a dose and stay on top of your medication schedule.
            </p>
            
            <div style={styles.socialIcons}>
              {[
                { icon: 'fa-linkedin', color: 'black' },
                { icon: 'fa-facebook', color: 'black' },
                { icon: 'fa-instagram', color: 'black' },
                { icon: 'fa-twitter', color: 'black' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(idx)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    ...styles.socialIcon,
                    transform: hoveredSocial === idx ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  <i className={`fa-brands ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sign Up Form */}
        <div style={styles.logregBox} className="signup-logreg-box">
          <div style={styles.formBox} className="signup-form-box">
            <h2 style={styles.formHeading} className="signup-form-heading">Sign Up</h2>
            
            {/* Username Input */}
            <div style={styles.inputBox} className="signup-input-box">
              <span style={styles.icon}>
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setname(e.target.value)}
                onFocus={() => setnameFocused(true)}
                onBlur={() => setnameFocused(false)}
                style={styles.input}
              />
              <label
                style={{
                  ...styles.label,
                  ...(nameFocused || name ? styles.labelFocused : {}),
                }}
              >
                name
              </label>
            </div>

            {/* Email Input */}
            <div style={styles.inputBox} className="signup-input-box">
              <span style={styles.icon}>
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={styles.input}
              />
              <label
                style={{
                  ...styles.label,
                  ...(emailFocused || email ? styles.labelFocused : {}),
                }}
              >
                Email
              </label>
            </div>

            {/* Phone Number Input */}
            <div style={styles.inputBox} className="signup-input-box">
              <span style={styles.icon}>
                <i className="fa-solid fa-phone"></i>
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                style={styles.input}
              />
              <label
                style={{
                  ...styles.label,
                  ...(phoneFocused || phone ? styles.labelFocused : {}),
                }}
              >
                Phone Number
              </label>
            </div>

            {/* Password Input */}
            <div style={styles.inputBox} className="signup-input-box">
              <span style={styles.icon}>
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={styles.input}
              />
              <label
                style={{
                  ...styles.label,
                  ...(passwordFocused || password ? styles.labelFocused : {}),
                }}
              >
                Password
              </label>
            </div>

            {/* Terms & Conditions */}
            <div style={styles.rememberForgot}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={styles.checkbox}
                />
                I agree to terms & conditions.
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              style={styles.btn}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Sign Up
            </button>

            {/* Sign In Link */}
            <div style={styles.loginLink}>
              <p>
                Already have an account?{' '}
                <a
                  onClick={() => navigate('/')}
                  style={styles.registerLink}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;