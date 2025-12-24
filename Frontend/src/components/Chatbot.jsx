import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MedicalChatbot() {
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your medical assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // Clear any previous errors
    setError(null);

    // Create user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Get auth token
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to use the chat assistant');
      }

      // Call backend API
      const response = await axios.post(
        'http://localhost:8080/api/chat',
        { message: currentInput },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: response.data.reply,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);

      let errorMessage = "I'm having trouble connecting right now. Please try again.";
      
      // Handle specific errors
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.reply || "Please enter a valid message.";
      } else if (error.response?.data?.reply) {
        errorMessage = error.response.data.reply;
      } else if (error.message === 'Please log in to use the chat assistant') {
        errorMessage = error.message;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to the server. Please check if the backend is running.";
      }

      // Add error message to chat
      const errorBotMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorBotMessage]);
      setError(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your medical assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="medical-chatbot">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
        }

        .medical-chatbot {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #0a4d3c 0%, #1a7a5e 25%, #2d9d78 50%, #1a7a5e 75%, #0a4d3c 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .medical-chatbot::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(72, 187, 120, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .chat-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          padding: 1.75rem 2rem;
          border-bottom: 1px solid rgba(16, 185, 129, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(10, 77, 60, 0.1);
          position: relative;
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .back-button {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #059669;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .back-button:hover {
          background: rgba(16, 185, 129, 0.15);
          transform: translateX(-2px);
        }

        .logo-container {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
          animation: pulse 3s ease-in-out infinite;
          font-size: 28px;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .header-info h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #0a4d3c;
          margin-bottom: 0.25rem;
          letter-spacing: -0.02em;
        }

        .header-info p {
          font-size: 0.875rem;
          color: #059669;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .new-chat-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 0.875rem 1.75rem;
          border-radius: 12px;
          font-size: 0.925rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .new-chat-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
        }

        .new-chat-btn:active {
          transform: translateY(0);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          position: relative;
          z-index: 1;
        }

        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 4px;
          transition: background 0.3s;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }

        .message {
          display: flex;
          gap: 1rem;
          animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation-fill-mode: forwards;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-user {
          flex-direction: row-reverse;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          font-size: 22px;
        }

        .avatar-bot {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .avatar-user {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }

        .message-content {
          max-width: 65%;
          animation: contentFade 0.5s ease 0.2s both;
        }

        @keyframes contentFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .message-bubble {
          padding: 1.25rem 1.5rem;
          border-radius: 18px;
          line-height: 1.6;
          font-size: 0.95rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .message-bot .message-bubble {
          background: rgba(255, 255, 255, 0.98);
          color: #1f2937;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .message-bot.error-message .message-bubble {
          background: rgba(254, 226, 226, 0.98);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #991b1b;
        }

        .message-user .message-bubble {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .message-time {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .message-bot .message-time {
          color: #059669;
        }

        .message-bot.error-message .message-time {
          color: #991b1b;
        }

        .typing-indicator {
          display: flex;
          gap: 1rem;
          animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .typing-bubble {
          background: rgba(255, 255, 255, 0.98);
          padding: 1.25rem 1.5rem;
          border-radius: 18px;
          display: flex;
          gap: 0.5rem;
          align-items: center;
          border: 1px solid rgba(16, 185, 129, 0.15);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: typingBounce 1.4s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .input-container {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          padding: 1.75rem 2rem;
          border-top: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 -4px 20px rgba(10, 77, 60, 0.1);
          position: relative;
          z-index: 10;
        }

        .disclaimer {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1rem;
          padding: 0.875rem 1.25rem;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          font-size: 0.8125rem;
          color: #92400e;
          font-weight: 500;
        }

        .input-wrapper {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .input-field {
          flex: 1;
          background: #f0fdf4;
          border: 2px solid rgba(16, 185, 129, 0.2);
          border-radius: 16px;
          padding: 1rem 1.25rem;
          font-size: 0.95rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1f2937;
          resize: none;
          max-height: 120px;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #10b981;
          background: white;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .input-field::placeholder {
          color: #6b7280;
        }

        .send-button {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          flex-shrink: 0;
          font-size: 22px;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }

        .send-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 1.25rem 1.25rem;
          }

          .header-left {
            gap: 0.75rem;
          }

          .back-button {
            padding: 0.625rem 0.875rem;
            font-size: 0.8125rem;
          }

          .header-info h1 {
            font-size: 1.375rem;
          }

          .header-info p {
            font-size: 0.8125rem;
          }

          .logo-container {
            width: 48px;
            height: 48px;
          }

          .messages-container {
            padding: 1.5rem 1.25rem;
          }

          .message-content {
            max-width: 85%;
          }

          .input-container {
            padding: 1.25rem;
          }

          .new-chat-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={goToDashboard}>
            ← Dashboard
          </button>
          <div className="logo-container">
            🩺
          </div>
          <div className="header-info">
            <h1>MEDtrack</h1>
            <p>
              <span className="status-indicator"></span>
              📊 AI Medical Assistant
            </p>
          </div>
        </div>
        <button className="new-chat-btn" onClick={startNewConversation}>
          ➕ New Conversation
        </button>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`message ${message.type === 'user' ? 'message-user' : 'message-bot'} ${message.isError ? 'error-message' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`avatar ${message.type === 'user' ? 'avatar-user' : 'avatar-bot'}`}>
              {message.type === 'user' ? '👤' : '🩺'}
            </div>
            <div className="message-content">
              <div className="message-bubble">
                {message.content}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <div className="avatar avatar-bot">
              🩺
            </div>
            <div className="typing-bubble">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <div className="disclaimer">
          ⚠️ This is for informational purposes only. Always consult with a healthcare professional for medical advice.
        </div>
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            className="input-field"
            placeholder="Describe your symptoms or ask a medical question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button 
            className="send-button" 
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
}