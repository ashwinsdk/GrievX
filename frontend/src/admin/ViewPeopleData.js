import React, { useState, useEffect } from 'react';
import './css/style.css';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function ViewPeopleData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask to view user data");
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

        // Check if current user is admin
        const [adminGovt, adminHead] = await Promise.all([
          contract.adminGovt(),
          contract.adminHead()
        ]);

        const currentAddress = await signer.getAddress();
        const userIsAdmin = currentAddress.toLowerCase() === adminGovt.toLowerCase() ||
          currentAddress.toLowerCase() === adminHead.toLowerCase();

        setIsAdmin(userIsAdmin);

        if (!userIsAdmin) {
          throw new Error("You must be an admin to view this data");
        }

        // Get all registered users
        const allUsers = await contract.viewAllUsers();

        // Format user data for display
        const formattedUsers = allUsers.map(user => ({
          name: user.name,
          email: user.email,
          dob: user.dob,
          taxPaid: ethers.formatEther(user.taxPaid) + " ETH",
          taxStatus: user.taxPaidStatus ? "Paid" : "Pending"
        }));

        setUsers(formattedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.reason || err.message);
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="projects-page">
        <div className="projects-box">
          <h2 className="projects-title">Loading User Data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div className="projects-box">
          <h2 className="projects-title">Access Restricted</h2>
          <p className="error-message">{error}</p>
          {!isAdmin && (
            <p className="admin-notice">
              This page is only accessible to government administrators.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-box">
        <h2 className="projects-title">Registered Citizens</h2>
        <p className="projects-subtext">Administrative view of all registered users</p>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Tax Paid</th>
                <th>Tax Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.dob}</td>
                    <td>{user.taxPaid}</td>
                    <td>
                      <span className={`status-badge ${user.taxStatus.toLowerCase()}`}>
                        {user.taxStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No registered users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewPeopleData;