import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../assets/images/back3.avif';
import axios from 'axios';

const Homepage = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [startBtnHovered, setStartBtnHovered] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: "'Poppins', sans-serif",
      boxSizing: 'border-box',
      backgroundImage: `url(${back})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: 'white',
    },
    header: {
      width: '100%',
      height: '100vh',
      backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${back})`,  // ✅ Combine gradient with image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '10px 3%',
      position: 'relative',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      color: 'white',
    },
    sideText: {
      color: 'rgba(184, 183, 183, 0.87)',
      padding: '10px 5px',
      borderRadius: '5px',
      fontSize: '38px',
      cursor: 'pointer',
      margin: 0,
    },
    signButton: {
      display: 'flex',
      gap: '10px',
    },
    button: {
      border: 0,
      outline: 0,
      color: 'white',
      padding: '7px 20px',
      fontSize: '22px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: '0.6s ease',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    buttonHovered: {
      background: 'rgb(240, 52, 46)',
      backgroundColor: 'rgb(240, 52, 46)',
      fontSize: '25px',
    },
    headerContent: {
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      marginTop: '100px',
      width: '90%',
      maxWidth: '1200px',
    },
    h1: {
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
      fontSize: '50px',
      marginBottom: '20px',
      lineHeight: '1.2',
    },
    h3: {
      fontSize: '28px',
      marginBottom: '10px',
      fontWeight: '400',
    },
    paragraph: {
      fontSize: '20px',
      marginBottom: '20px',
    },
    startButton: {
      border: 0,
      outline: 0,
      color: 'white',
      background: 'rgb(240, 52, 46)',
      padding: '7px 20px',
      fontSize: '26px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: '0.6s ease',
      marginTop: '10px',
      animation: 'pulse 2s infinite',
      boxShadow: '0 4px 15px rgba(240, 52, 46, 0.4)',
    },
    startButtonHovered: {
      fontSize: '28px',
    },
    section: {
      padding: '80px 10%',
      fontSize: 'larger',
      textAlign: 'center',
      backgroundColor: 'rgb(59, 52, 52)',
    },
    sectionHeading: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      fontWeight: '600',
    },
    cardsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
      marginTop: '40px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      width: '45%',
      minWidth: '280px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
    },
    cardHovered: {
      backgroundColor: 'rgb(233, 56, 56)',
      transform: 'translateY(-10px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
    cardTitle: {
      marginBottom: '15px',
      color: '#333',
      fontSize: '1.5rem',
      fontWeight: '600',
      transition: 'color 0.3s',
    },
    cardTitleHovered: {
      color: 'aliceblue',
    },
    cardText: {
      color: '#666',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '1.6',
      transition: 'color 0.3s',
    },
    cardTextHovered: {
      color: 'aliceblue',
    },
    contact: {
      color: 'white',
      backgroundColor: '#414141',
      border: '2px solid grey',
      padding: '80px 10%',
      textAlign: 'center',
      fontSize: 'larger',
    },
    contactLink: {
      color: 'rgb(240, 52, 46)',
      textDecoration: 'none',
      fontWeight: '600',
    },
    footer: {
      color: '#fff',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'black',
    },
  };

  const features = [
    {
      title: 'Smart Reminders ⏰',
      description: 'Never miss a dose with automatic reminders tailored to your schedule.',
    },
    {
      title: 'AI Chatbot 💬',
      description: 'Get instant assistance and answers to your medication queries.',
    },
    {
      title: 'Health Tracking 📊',
      description: 'Monitor your progress and see insights about your health habits.',
    },
    {
      title: 'Notifications 🔔',
      description: 'Receive timely notifications to stay on top of your medication routine.',
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.body}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Header Section */}
      <div style={styles.header}>
        <nav style={styles.nav}>
          <h2 style={styles.sideText}>Doodle Developers</h2>
          <div style={styles.signButton}>
            <button
              style={{
                ...styles.button,
                ...(hoveredButton === 'signin' ? styles.buttonHovered : {}),
              }}
              onMouseEnter={() => setHoveredButton('signin')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handleNavigation('/signin')}
            >
              <b>Sign In</b>
            </button>
            <button
              style={{
                ...styles.button,
                ...(hoveredButton === 'signup' ? styles.buttonHovered : {}),
              }}
              onMouseEnter={() => setHoveredButton('signup')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handleNavigation('/signup')}
            >
              <b>Sign Up</b>
            </button>
          </div>
        </nav>

        <div style={styles.headerContent}>
          <h1 style={styles.h1}>
            Never miss a dose again. <br />
            Gentle reminders from your caring companion.
          </h1>
          <h3 style={styles.h3}>Your health, always on schedule with MedTrack</h3>
          <p style={styles.paragraph}>
            User friendly? Absolutely! - with a Chatbot Ready to help.
          </p>
          <button
            style={{
              ...styles.startButton,
              ...(startBtnHovered ? styles.startButtonHovered : {}),
            }}
            onMouseEnter={() => setStartBtnHovered(true)}
            onMouseLeave={() => setStartBtnHovered(false)}
            onClick={() => handleNavigation('/signin')}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" style={styles.section}>
        <h2 style={styles.sectionHeading}>Features</h2>
        <div style={styles.cardsContainer}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                ...(hoveredCard === index ? styles.cardHovered : {}),
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3
                style={{
                  ...styles.cardTitle,
                  ...(hoveredCard === index ? styles.cardTitleHovered : {}),
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  ...styles.cardText,
                  ...(hoveredCard === index ? styles.cardTextHovered : {}),
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.contact}>
        <h2 style={styles.sectionHeading}>Contact Us</h2>
        <p>
          Have questions? Reach out to us at{' '}
          <a href="mailto:support@medtrack.com" style={styles.contactLink}>
            support@medtrack.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 MedTrack | Built by Doodle Developers</p>
      </footer>
    </div>
  );
};

export default Homepage;