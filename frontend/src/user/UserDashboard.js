import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/style.css";

const UserDashboard = () => {
  const location = useLocation();
  const userName = location.state?.userName || "User";

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

          <Link to="/ongoing-projects" className="card">
            <h3>Ongoing Projects</h3>
            <p>Know what the municipality is building near you.</p>
          </Link>
        </div>

        <div className="dashboard-row">
          <Link to="/government-funds" className="card">
            <h3>Government Funds</h3>
            <p>Transparency in fund allocation and usage.</p>
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

          <Link to="/all-grievances" className="card">
            <h3>All Grievances</h3>
            <p>Engage with your community’s collective concerns.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
