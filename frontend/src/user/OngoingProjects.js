import React, { useEffect, useState } from 'react';
import './css/style.css';

function OngoingProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockProjects = [
      {
        pname: 'Road Construction',
        details: 'Main street renovation',
        customFund: '₹50,000',
        status: 'In Progress'
      },
      {
        pname: 'Park Development',
        details: 'Central park upgrade',
        customFund: '₹30,000',
        status: 'Planning'
      }
    ];
    setProjects(mockProjects);
  }, []);

  return (
    <div className="projects-page">
      <div className="projects-box">
        <h2 className="projects-title">Ongoing Municipal Projects</h2>
        <p className="projects-subtext">Track the progress and funding of active initiatives.</p>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Fund</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.pname}</td>
                    <td>{project.details}</td>
                    <td>{project.customFund}</td>
                    <td>{project.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OngoingProjects;
