import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const [hoveredValue, setHoveredValue] = useState(null);
  const [backBtnHovered, setBackBtnHovered] = useState(false);

  const styles = {
    container: {
      // backgroundImage: url('Images/back.png'),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    gradientSection: {
      width: '100%',
      height: '50vh',
      background: 'linear-gradient(135deg, #4a9eff, #8a5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
    },
    gradientContent: {
      textAlign: 'center',
      color: 'white',
      maxWidth: '1000px',
    },
    mainHeading: {
      fontSize: '5rem',
      marginBottom: '1.5rem',
      fontWeight: 700,
      textShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
    },
    mainSubheading: {
      fontSize: '2rem',
      fontWeight: 300,
      textShadow: '1px 1px 5px rgba(0, 0, 0, 0.2)',
    },
    aboutContent: {
      width: '100%',
      minHeight: '50vh',
      background: '#f8f9fa',
      padding: '4rem 2rem',
    },
    contentWrapper: {
      maxWidth: '1100px',
      margin: '0 auto',
    },
    mission: {
      marginBottom: '4rem',
    },
    sectionHeading: {
      fontSize: '3rem',
      color: '#2c3e50',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    missionParagraph: {
      fontSize: '1.5rem',
      color: '#4a5568',
      lineHeight: 1.8,
      marginBottom: '1.5rem',
    },
    valuesSection: {
      marginTop: '4rem',
    },
    valueItem: {
      display: 'flex',
      gap: '2rem',
      marginBottom: '3rem',
      padding: '2.5rem',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    valueItemHovered: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(74, 158, 255, 0.2)',
    },
    valueIcon: {
      flexShrink: 0,
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #4a9eff, #8a5cf6)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.2rem',
      fontWeight: 'bold',
    },
    valueText: {
      flex: 1,
    },
    valueHeading: {
      fontSize: '1.8rem',
      color: '#2c3e50',
      marginBottom: '0.8rem',
    },
    valueParagraph: {
      color: '#4a5568',
      lineHeight: 1.6,
      fontSize: '1.3rem',
    },
    backButton: {
      position: 'fixed',
      top: '2rem',
      left: '2rem',
      padding: '0.8rem 1.5rem',
      background: 'white',
      color: '#4a9eff',
      border: '2px solid white',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      zIndex: 1000,
    },
    backButtonHovered: {
      background: 'linear-gradient(135deg, #4a9eff, #8a5cf6)',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(74, 158, 255, 0.4)',
    },
  };

  const values = [
    {
      icon: '✓',
      title: 'Simplicity First',
      description: "Healthcare shouldn't be complicated. We design every feature with ease of use in mind, making medication management accessible to everyone.",
    },
    {
      icon: '✓',
      title: 'Your Health, Our Priority',
      description: "We're committed to helping you maintain consistent medication routines, improving health outcomes one reminder at a time.",
    },
    {
      icon: '✓',
      title: 'Always Here for You',
      description: "With smart reminders, AI assistance, and timely notifications, we ensure you're never alone in your health journey.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          ...styles.backButton,
          ...(backBtnHovered ? styles.backButtonHovered : {}),
        }}
        onMouseEnter={() => setBackBtnHovered(true)}
        onMouseLeave={() => setBackBtnHovered(false)}
      >
        <span style={{ fontSize: '1.2rem' }}>←</span>
        <span>Back to Home</span>
      </button>

      {/* Upper Half - Gradient Section */}
      <section style={styles.gradientSection}>
        <div style={styles.gradientContent}>
          <h1 style={styles.mainHeading}>About Us</h1>
          <p style={styles.mainSubheading}>
            Empowering healthier lives through smart medication management
          </p>
        </div>
      </section>

      {/* Lower Half - About Content Section */}
      <section style={styles.aboutContent}>
        <div style={styles.contentWrapper}>
          {/* Mission Section */}
          <div style={styles.mission}>
            <h2 style={styles.sectionHeading}>Our Mission</h2>
            <p style={styles.missionParagraph}>
              At MedTrack, we believe staying healthy should be effortless. Our mission is to help users manage their medications and never miss a dose again. 💊💚
            </p>
            <p style={styles.missionParagraph}>
              We understand that managing multiple medications can be overwhelming. That's why we've created a simple, intuitive platform that takes the stress out of medication management and puts your health first.
            </p>
          </div>

          {/* Values Section */}
          <div style={styles.valuesSection}>
            <h2 style={styles.sectionHeading}>Our Values</h2>
            
            {values.map((value, index) => (
              <div
                key={index}
                style={{
                  ...styles.valueItem,
                  ...(hoveredValue === index ? styles.valueItemHovered : {}),
                }}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <div style={styles.valueIcon}>{value.icon}</div>
                <div style={styles.valueText}>
                  <h3 style={styles.valueHeading}>{value.title}</h3>
                  <p style={styles.valueParagraph}>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;