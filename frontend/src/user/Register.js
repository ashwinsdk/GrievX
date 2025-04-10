import React, { useState } from 'react';
import './css/style.css';
import { Link, useNavigate } from 'react-router-dom';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const navigate = useNavigate();

  const registerUser = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

        // Check if the user is already registered
        const userAddress = await signer.getAddress();
        const isRegistered = await contract.users(userAddress).isRegistered;

        if (isRegistered) {
          alert('User is already registered!');
          return;
        }

        // Validate inputs
        if (!name.trim()) {
          alert('Name cannot be empty');
          return;
        }

        // Call the registerUser function
        try {
          const tx = await contract.registerUser(name, email, dob);
          await tx.wait();
          alert('User Registered Successfully');
          // Optionally clear the form
          setName('');
          setEmail('');
          setDob('');
          // If we get here, login is successful
          navigate('/user-dashboard');
        } catch (error) {
          console.error("Transaction Error:", error);
          let errorMessage = 'Registration failed';

          if (error.reason) {
            errorMessage = error.reason;
          } else if (error.data?.message) {
            errorMessage = error.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          alert(errorMessage);
        }
      } catch (error) {
        console.error("Error:", error);
        alert('Error connecting to MetaMask or contract');
      }
    } else {
      alert('Please install MetaMask to register!');
    }
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
            required
          />

          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
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