import React from "react";
import { Link } from "react-router-dom";
import "./css/style.css";

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1 className="hero-title">GrievX</h1>
        <p className="hero-subtitle">
          Blockchain-powered transparency and trust in urban governance.
        </p>
      </section>

      <section className="about-section">
        <h2>About Block-Dock</h2>
        <p>
          Block-Dock is a secure Ethereum-based platform built to simplify grievance handling and 
          manage public funds transparently. Our goal is to connect citizens and officials with 
          blockchain-backed clarity.
        </p>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>File Grievance</h3>
            <p>Submit and track public complaints with integrity and transparency.</p>
          </div>
          <div className="service-card">
            <h3>Fund Management</h3>
            <p>Oversee government fund distribution and project allocations.</p>
          </div>
          <div className="service-card">
            <h3>Project Monitoring</h3>
            <p>Track ongoing development initiatives within your locality.</p>
          </div>
          <div className="service-card">
            <h3>Secure Records</h3>
            <p>Immutable logs and data storage using blockchain technology.</p>
          </div>
        </div>
      </section>

      <div className="button-container">
        <Link to="/login" className="connect-button">
          Connect Wallet
        </Link>
      </div>
    </div>
  );
}

export default Home;
