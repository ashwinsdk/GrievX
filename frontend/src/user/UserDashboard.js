import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/style.css";
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

const UserDashboard = () => {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window.ethereum === 'undefined') {
        setError("MetaMask is not installed");
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
        const user = await contract.users(userAddress);

        if (user.isRegistered) {
          setUserName(user.name);
        } else {
          setError("User not registered");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="user-dashboard">
        <header className="dashboard-topbar">
          <h1 className="dashboard-brand">GrievX</h1>
        </header>
        <div className="loading-message">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <header className="dashboard-topbar">
          <h1 className="dashboard-brand">GrievX</h1>
        </header>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-topbar">
        <h1 className="dashboard-brand">GrievX</h1>
        <p className="dashboard-welcome">Welcome, {userName}!</p>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-row">
          <Link to="/file-grievances" className="card">
            <h3>File Grievance</h3>
            <p>Raise your civic issues instantly and track resolution.</p>
          </Link>
          <Link to="/pay-taxes" className="card">
            <h3>Pay Taxes</h3>
            <p>Transparency in fund allocation and usage.</p>
          </Link>
        </div>

        <div className="dashboard-row">

          <Link to="/ongoing-projects" className="card">
            <h3>Ongoing Projects</h3>
            <p>Know what the municipality is building near you.</p>
          </Link>

          <Link to="/contact-us" className="card">
            <h3>Contact Admin</h3>
            <p>Get direct support from your local body.</p>
          </Link>
        </div>

        <div className="dashboard-row">
          <Link to="/my-grievances" className="card">
            <h3>My Grievances</h3>
            <p>Review and monitor all your previous reports.</p>
          </Link>

          {/* <Link to="/all-grievances" className="card">
            <h3>All Grievances</h3>
            <p>Engage with your community's collective concerns.</p>
          </Link> */}
        </div>
      </section>

      <Link to="/" className="back-home-X">← Back to Home</Link>
    </div>
  );
};

export default UserDashboard;