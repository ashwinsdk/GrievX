import React, { useState } from 'react';
import "./css/style.css";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    alert('Login successful');
    navigate('/user-dashboard', { state: { userName: "John Doe" } });
    setLoading(false);
  };

  return (
    <div className="login-dark-container">
      <div className="login-card">
        <h1 className="login-title">GrievX</h1>
        <p className="login-subtitle">Login with your MetaMask wallet</p>

        <button className="connect-button" onClick={handleLogin}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>

        <p className="register-text">
          New user? <Link to="/register" className="register-link">Register here</Link>
        </p>

        <Link to="/" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Login;
