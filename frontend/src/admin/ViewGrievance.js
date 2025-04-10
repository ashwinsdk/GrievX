import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/style.css';

function ViewGrievance() {
  const [grievances, setGrievances] = useState([
    { name: 'John Doe', details: 'Street light not working', status: 'PENDING' },
    { name: 'Jane Smith', details: 'Garbage not collected', status: 'PENDING' }
  ]);
  const navigate = useNavigate();

  const handleEditStatus = (grievanceIndex, newStatus) => {
    const updatedGrievances = grievances.map((g, index) =>
      index === grievanceIndex ? { ...g, status: newStatus } : g
    );
    setGrievances(updatedGrievances);
    alert(`Grievance status updated to ${newStatus}`);
  };

  return (
    <div className="people-data-container">
      <header className="header">
        <h1>Block-Dock</h1>
      </header>

      <main className="content">
        <h2>Edit Grievances</h2>
        <table className="people-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((grievance, index) => (
              <tr key={index}>
                <td>{grievance.name}</td>
                <td>{grievance.details}</td>
                <td>{grievance.status}</td>
                <td>
                  <button onClick={() => handleEditStatus(index, 'ACCEPTED')}>
                    Accept
                  </button>
                  <button onClick={() => handleEditStatus(index, 'REJECTED')}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default ViewGrievance;