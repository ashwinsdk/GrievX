import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/style.css';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function MyGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGrievances = async () => {
      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask to view grievances');
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

        // Call the viewMyGrievances function directly
        const myGrievances = await contract.viewMyGrievances();

        // Transform the data for display
        const formattedGrievances = myGrievances.map((grievance, index) => ({
          id: index + 1,
          name: grievance.name,
          details: grievance.details,
          status: grievance.status,
          timestamp: new Date(Number(grievance.timestamp) * 1000).toLocaleDateString()
        }));

        setGrievances(formattedGrievances);
      } catch (err) {
        console.error('Error fetching grievances:', err);
        setError(err.reason || 'Failed to load your grievances');
      } finally {
        setLoading(false);
      }
    };

    fetchMyGrievances();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper fade-in">
        <h1 className="logo">GrievX</h1>
        <div className="loading-message">Loading your grievances...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper fade-in">
        <h1 className="logo">GrievX</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

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
                <th>ID</th>
                <th>Name</th>
                <th>Details</th>
                <th>Status</th>
                <th>Date Filed</th>
              </tr>
            </thead>
            <tbody>
              {grievances.length > 0 ? (
                grievances.map((grievance) => (
                  <tr key={grievance.id}>
                    <td>{grievance.id}</td>
                    <td>{grievance.name}</td>
                    <td>{grievance.details}</td>
                    <td className={`status-${grievance.status.toLowerCase()}`}>
                      {grievance.status}
                    </td>
                    <td>{grievance.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No grievances found. File your first grievance to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link to="/user-dashboard" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
}

export default MyGrievances;