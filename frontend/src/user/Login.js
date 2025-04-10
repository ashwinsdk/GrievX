import React, { useState } from 'react';
import "./css/style.css";
import { Link, useNavigate } from 'react-router-dom';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    if (!window.ethereum) {
      setError('Please install MetaMask to login');
      setLoading(false);
      return;
    }

    try {
      // Request account access first
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        provider
      );

      // First check admin roles (before checking user registration)
      const [adminGovt, adminHead, user] = await Promise.all([
        contract.adminGovt(),
        contract.adminHead(),
        contract.users(userAddress).catch(() => ({ isRegistered: false })) // Gracefully handle if user not registered
      ]);

      // Determine role and redirect
      let redirectPath = '/user-dashboard';
      let role = 'user';
      let userName = 'Admin';

      if (userAddress.toLowerCase() === adminGovt.toLowerCase()) {
        redirectPath = '/admin-govt-home';
        role = 'adminGovt';
        userName = 'Government Admin';
      } else if (userAddress.toLowerCase() === adminHead.toLowerCase()) {
        redirectPath = '/admin-head-home';
        role = 'adminHead';
        userName = 'Municipal Head';
      } else if (!user.isRegistered) {
        setError('User not registered. Please register first.');
        setLoading(false);
        return;
      } else {
        userName = user.name; // Use registered user's name
      }

      navigate(redirectPath, {
        state: {
          userName: userName,
          userAddress: userAddress,
          role: role
        }
      });

    } catch (err) {
      console.error("Login error:", err);
      setError(err.reason || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-dark-container">
      <div className="login-card">
        <h1 className="login-title">GrievX</h1>
        <p className="login-subtitle">Login with your MetaMask wallet</p>

        {error && <div className="error-message">{error}</div>}

        <button
          className="connect-button"
          onClick={handleLogin}
          disabled={loading}
        >
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