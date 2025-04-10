import React from 'react';
import './css/style.css';

function ContactUs() {
  const fetchedAdminHead = "0xAdminHeadAddress";
  const fetchedAdminGovt = "0xAdminGovtAddress";

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
      </div>
    </div>
  );
}

export default ContactUs;
