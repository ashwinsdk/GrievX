import React, { useState, useEffect } from 'react';
import './css/style.css';

import { Link } from 'react-router-dom';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function ContactUs() {
  const [fetchedAdminGovt, setFetchedAdminGovt] = useState("");
  const [fetchedAdminHead, setFetchedAdminHead] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdminDetails() {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

        const govt = await contract.adminGovt();
        const head = await contract.adminHead();

        setFetchedAdminGovt(govt === "0x0000000000000000000000000000000000000000" ? "Not assigned" : govt);
        setFetchedAdminHead(head === "0x0000000000000000000000000000000000000000" ? "Not assigned" : head);
      } catch (err) {
        console.error("Error fetching admin details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminDetails();
  }, []);

  if (loading) {
    return <div className="contactus-page">Loading...</div>;
  }

  if (error) {
    return <div className="contactus-page">Error: {error}</div>;
  }

  return (
    <div className="contactus-page">
      <div className="contactus-box">
        <h2 className="contactus-title">Municipality Administration Details</h2>

        <div className="admin-role">
          <h3>Municipality Head (Admin-Head)</h3>
          <p>
            <strong>Role:</strong> Oversees funds, allocates funds for projects, assigns contractors, and views individual tax details.<br />
            <strong>Authentication:</strong> MetaMask authentication for secure access.<br />
            <strong>Key Actions:</strong> Manages fund allocation and project licensing to ensure transparent fund utilization.
          </p>
          <p className="wallet-address"><strong>Wallet Address:</strong> {fetchedAdminHead}</p>
        </div>

        <div className="admin-role">
          <h3>Government Department Officer</h3>
          <p>
            <strong>Role:</strong> Manages fund transfers to the municipality, monitors tax collection and fund allocation, and oversees financial integrity.<br />
            <strong>Authentication:</strong> MetaMask authentication for secure access.<br />
            <strong>Key Actions:</strong> Ensures that all allocated funds are transparent and accessible for public viewing.
          </p>
          <p className="wallet-address"><strong>Wallet Address:</strong> {fetchedAdminGovt}</p>
        </div>
        <Link to="/user-dashboard" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
}

export default ContactUs;