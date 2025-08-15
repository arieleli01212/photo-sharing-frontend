import React, { useState, useEffect } from 'react';
import './Login.css';

export function Login({ onLogin, API }) {
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
        }
      );
    }

  }, []);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await fetch(`${API}/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await result.json();

      if (result.ok) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('username', data.username);
        onLogin(data);
      } else {
        setError(data.detail || 'Google login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Ariel & Ya'ara</h1>
          <p>Wedding Photo Sharing</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div id="google-signin-button" style={{ width: '100%', marginBottom: '15px' }}></div>
        {googleLoading && (
          <div style={{ textAlign: 'center', margin: '10px 0', color: '#8e8e8e' }}>
            Signing in with Google...
          </div>
        )}

      </div>
    </div>
  );
}