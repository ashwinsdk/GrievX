import React from 'react';
import { Link } from 'react-router-dom';
import './css/style.css';

const AdminHeadHome = () => {
  return (
    <div className="page-wrapper fade-in">
      <h1 className="logo">GrievX</h1>

      <h2 className="section-title">Welcome, Municipality Head</h2>
      {/* 
      <div className="grid-cards">

        <div className="card">
          <h3>View Grievance</h3>
          <p>Review and resolve grievances raised by city residents.</p>
          <Link to="/view-grievance">
            <button className="action-btn">View Grievance</button>
          </Link>
        </div>

        <div className="card">
          <h3>Fund Allocation</h3>
          <p>Allocate funds to specific projects for urban development.</p>
          <Link to="/fund-allocation">
            <button className="action-btn">Fund Allocation</button>
          </Link>
        </div>

        <div className="card">
          <h3>View People Data</h3>
          <p>Access data of residents and registered entities.</p>
          <Link to="/view-people-data">
            <button className="action-btn">View People Data</button>
          </Link>
        </div>

        <div className="card">
          <h3>Admin Details</h3>
          <p>Reach out to us for any queries or assistance.</p>
          <Link to="/contact-us">
            <button className="action-btn">Details</button>
          </Link>
        </div>
      </div> */}
      <section className="dashboard-content">
        <div className="dashboard-row">
          <Link to="/view-grievance" className="card">
            <h3>Edit Grievance</h3>
            <p>Review and resolve grievances raised by city residents.</p>
          </Link>

          <Link to="/fund-allocation" className="card">
            <h3>Fund Allocation</h3>
            <p>Allocate funds to specific projects for urban development.</p>
          </Link>
        </div>

        <div className="dashboard-row">

          <Link to="/view-people-data" className="card">
            <h3>View People Data</h3>
            <p>Know what the municipality is building near you.</p>
          </Link>

        </div>
        <Link to="/" className="back-home-X">← Back to Home</Link>

      </section>
    </div>
  );
};

export default AdminHeadHome;
