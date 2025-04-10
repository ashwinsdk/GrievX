import React, { useState, useEffect } from 'react';
import './css/style.css';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function ViewGrievance() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingGrievance, setEditingGrievance] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchGrievances();
  }, []);

  async function fetchGrievances() {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to view grievances");
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      // Check admin status
      const [adminGovt, adminHead] = await Promise.all([
        contract.adminGovt(),
        contract.adminHead()
      ]);

      const currentAddress = await signer.getAddress();
      const userIsAdmin = currentAddress.toLowerCase() === adminGovt.toLowerCase() ||
        currentAddress.toLowerCase() === adminHead.toLowerCase();

      setIsAdmin(userIsAdmin);

      // Get grievances based on user role
      let grievancesData;
      if (userIsAdmin) {
        grievancesData = await contract.viewAllGrievances();
      } else {
        grievancesData = await contract.viewMyGrievances();
      }

      // Format grievance data
      const formattedGrievances = grievancesData.map((grievance, index) => ({
        id: index,
        name: grievance.name,
        details: grievance.details,
        status: grievance.status,
        timestamp: new Date(Number(grievance.timestamp) * 1000).toLocaleString(),
        user: grievance.user
      }));

      setGrievances(formattedGrievances);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching grievances:", err);
      setError(err.reason || err.message);
      setLoading(false);
    }
  }

  const handleEditClick = (grievance) => {
    setEditingGrievance(grievance);
    setNewStatus(grievance.status);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleCancelEdit = () => {
    setEditingGrievance(null);
    setNewStatus('');
  };

  const handleSaveEdit = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      setLoading(true);
      const tx = await contract.updateGrievanceStatus(editingGrievance.id, newStatus);
      await tx.wait();

      // Refresh grievances after update
      await fetchGrievances();
      setEditingGrievance(null);
      setNewStatus('');
    } catch (err) {
      console.error("Error updating grievance:", err);
      setError(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="projects-page">
        <div className="projects-box">
          <h2 className="projects-title">Loading Grievances...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div className="projects-box">
          <h2 className="projects-title">Error</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-box">
        <h2 className="projects-title">
          {isAdmin ? 'All Grievances' : 'My Grievances'}
        </h2>
        <p className="projects-subtext">
          {isAdmin ? 'View and manage all grievances' : 'Track your submitted grievances'}
        </p>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Details</th>
                <th>Status</th>
                <th>Submitted On</th>
                {isAdmin && <th>Submitted By</th>}
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {grievances.length > 0 ? (
                grievances.map((grievance, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{grievance.name}</td>
                      <td>{grievance.details}</td>
                      <td>
                        <span className={`status-badge ${grievance.status.toLowerCase()}`}>
                          {grievance.status}
                        </span>
                      </td>
                      <td>{grievance.timestamp}</td>
                      {isAdmin && (
                        <td className="address-cell">
                          {`${grievance.user.substring(0, 6)}...${grievance.user.substring(grievance.user.length - 4)}`}
                        </td>
                      )}
                      {isAdmin && (
                        <td>
                          <button
                            className="edit-button"
                            onClick={() => handleEditClick(grievance)}
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                    {editingGrievance && editingGrievance.id === grievance.id && (
                      <tr className="edit-row">
                        <td colSpan={isAdmin ? 7 : 6}>
                          <div className="edit-form">
                            <select
                              value={newStatus}
                              onChange={handleStatusChange}
                              className="status-select"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="ACCEPTED">Accepted</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                            <button
                              className="save-button"
                              onClick={handleSaveEdit}
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              className="cancel-button"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5}>No grievances found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link to="/admin-head-home" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
}

export default ViewGrievance;