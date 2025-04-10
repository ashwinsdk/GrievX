import React, { useState } from 'react';
import './css/style.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');

  const registerUser = async () => {
    alert('User Registered Successfully');
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="register-title">GrievX</h2>
        <div className="register-form">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />

          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

          <label>Phone Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter phone number"
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />

          <button className="connect-button" onClick={registerUser}>
            Register
          </button>
          <p className="register-link-text">
            Already have an account?{' '}
            <Link className="register-link" to="/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
