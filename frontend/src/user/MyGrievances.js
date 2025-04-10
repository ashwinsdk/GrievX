import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/style.css';

function MyGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [activeAccount, setActiveAccount] = useState("0x123...");
  const navigate = useNavigate();

  useEffect(() => {
    const mockGrievances = [
      { user: '0x123...', name: 'John Doe', details: 'Street light not working', status: 'Pending' },
      { user: '0x456...', name: 'Jane Smith', details: 'Garbage not collected', status: 'Resolved' }
    ];
    setGrievances(mockGrievances);
  }, []);

  const filteredGrievances = grievances.filter(
    grievance => grievance.user.toLowerCase() === activeAccount.toLowerCase()
  );

  return (
    <div className="page-wrapper fade-in">
      <h1 className="logo">GrievX</h1>

      <div className="card-box">
        <h2 className="section-title">My Grievances</h2>
        <p className="section-subtitle">Listed below are the grievances you have filed.</p>

        <div className="custom-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.length > 0 ? (
                filteredGrievances.map((grievance, index) => (
                  <tr key={index}>
                    <td>{grievance.name || 'N/A'}</td>
                    <td>{grievance.details || 'N/A'}</td>
                    <td>{grievance.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No grievances found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyGrievances;
