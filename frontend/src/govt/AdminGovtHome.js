import React from 'react';
import { Link } from 'react-router-dom';
import './css/style.css';

const AdminGovtHome = () => {
  return (
    <div className="page-wrapper fade-in">
      <h1 className="logo">GrievX</h1>

      <h2 className="section-title">Welcome, Government Admin</h2>

      {/* <div className="grid-cards">

        <div className="card">
          <h3>Project Funds</h3>
          <p>Allocate and send funds to municipalities for various projects and needs.</p>
          <Link to="/send-funds">
            <button className="action-btn">Send Funds</button>
          </Link>
        </div>

        <div className="card">
          <h3>View Grievance Status</h3>
          <p>Check the status of public grievances and address them promptly.</p>
          <Link to="/all-grievances">
            <button className="action-btn">View Grievance Status</button>
          </Link>
        </div>

        <div className="card">
          <h3>View People Data</h3>
          <p>Access and review data of people under your governance.</p>
          <Link to="/view-people-data">
            <button className="action-btn">View People Data</button>
          </Link>
        </div>

        <div className="card">
          <h3>Assign Admin Head</h3>
          <p>Designate new admin heads using their wallet addresses.</p>
          <Link to="/govt/assign-admin-head">
            <button className="action-btn">Assign</button>
          </Link>
        </div>

        <div className="card">
          <h3>Assign Taxes</h3>
          <p>Monitor ongoing government-backed projects.</p>
          <Link to="/govt/assign-taxes">
            <button className="action-btn">View Projects</button>
          </Link>
        </div>


      </div> */}
      <section className="dashboard-content">
        <div className="dashboard-row">
          <Link to="/send-funds" className="card">
            <h3>Project Funds</h3>
            <p>Allocate and send funds to municipalities for various projects and needs.</p>
          </Link>
          <Link to="/all-grievances" className="card">
            <h3>View Grievance Status</h3>
            <p>Check the status of public grievances and address them promptly.</p>
          </Link>
        </div>

        <div className="dashboard-row">

          <Link to="/govt/assign-admin-head" className="card">
            <h3>Assign Admin Head</h3>
            <p>Designate new admin heads using their wallet addresses.</p>
          </Link>

          <Link to="/govt/assign-taxes" className="card">
            <h3>Assign Taxes</h3>
            <p>Monitor ongoing government-backed projects.</p>
          </Link>
        </div>

        <div className="dashboard-row">
          <Link to="/view-people-data" className="card">
            <h3>View People Data</h3>
            <p>Know what the municipality is building near you.</p>
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

export default AdminGovtHome;
