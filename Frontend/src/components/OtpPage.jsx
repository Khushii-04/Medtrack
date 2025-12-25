import { useState, useRef,useEffect } from "react";
import { useLocation } from "react-router-dom";


function OtpPage({ onVerified = () => alert("Verified!") }) {

    const location = useLocation();
    const email = location.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    document.body.style.backgroundColor = "#65ABDD"; // <-- page background color
    return () => {
      document.body.style.backgroundColor = ""; // reset on unmount
    };
  }, []);
  
  
  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^[0-9]?$/.test(value)) return; 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    
    if (newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleVerify = async (enteredOtp) => {
  try {
    const response = await fetch('http://localhost:8080/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: enteredOtp }) 
    });

    const data = await response.json();

    if (response.ok) {
      onVerified();
    } else {
      setError(data.message); 
    }
  } catch (err) {
    console.error(err);
    setError('Something went wrong. Try again.');
  }
};


const handleResend = async () => {
  try {
    const response = await fetch('http://localhost:8080/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('OTP has been resent to your email');
      setError(''); 
      setError(data.message || 'Failed to resend OTP');
    }
  } catch (err) {
    console.error(err);
    setError('Something went wrong. Try again.');
  }
};


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div style={styles.container}>
      

      <p>Enter the 6-digit OTP sent to <strong>{email}</strong></p>
      <div style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.otpInput}
          />
        ))}
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <button onClick={() => handleVerify(otp.join(""))} style={styles.verifyButton}>
        Verify OTP
      </button>
      <p style={styles.resend}>
        Didn't receive OTP? 
        <span style={{ color: "blue", cursor: "pointer" }} onClick={handleResend}>
    Resend
  </span>
      </p>
    </div>
  );
}


const styles = {
   
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    border: "1px solid #276ddeff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor : "#9ec1daff"

   
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0"
  },
  otpInput: {
    width: "50px",
    height: "50px",
    fontSize: "24px",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  error: {
    color: "red",
    marginTop: "10px"
  },
  verifyButton: {
    padding: "10px 20px",
    backgroundColor: "#110151ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px"
  },
  resend: {
    marginTop: "15px",
    fontSize: "14px"
  }
};

export default OtpPage;
