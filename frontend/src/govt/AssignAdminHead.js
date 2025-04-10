import React, { useState } from 'react';
import './css/style.css';
import { useNavigate, Link } from 'react-router-dom';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

const AssignAdminHead = () => {
  const navigate = useNavigate();
  const [adminHeadAddress, setAdminHeadAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!window.ethereum) {
      setError('Please install MetaMask');
      setLoading(false);
      return;
    }

    try {
      // Validate address
      if (!ethers.isAddress(adminHeadAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      // Call the smart contract function
      const tx = await contract.assignAdminHead(adminHeadAddress);
      await tx.wait();

      alert('Admin Head assigned successfully!');
      navigate("/admin-govt-home");
    } catch (err) {
      console.error("Error assigning admin head:", err);
      setError(err.message || 'Failed to assign Admin Head');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-admin-head-container">
      <div className="assign-admin-head-content">
        <h2 className="assign-admin-head-title">Assign Admin Head</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="assign-admin-head-form">
          <div className="assign-admin-head-input-group">
            <label htmlFor="address" className="assign-admin-head-input-label">
              Metamask Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={adminHeadAddress}
              onChange={(e) => setAdminHeadAddress(e.target.value)}
              className="assign-admin-head-input-field"
              placeholder="0x..."
              required
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="connect-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Assign'}
            </button>
          </div>
        </form>
        <Link to="/admin-govt-home" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
};

export default AssignAdminHead;