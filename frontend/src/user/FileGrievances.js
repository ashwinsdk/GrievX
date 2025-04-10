import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './css/style.css';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

const FileGrievances = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      if (typeof window.ethereum === 'undefined') {
        setError("MetaMask is not installed");
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
        const user = await contract.users(userAddress);

        if (user.isRegistered) {
          setFormData(prev => ({
            ...prev,
            name: user.name
          }));
        } else {
          setError("User not registered");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setError("Grievance details cannot be empty");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      const tx = await contract.fileGrievance(formData.description);
      await tx.wait();

      alert(`Your grievance has been successfully filed.`);
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Error filing grievance:", err);
      setError(err.reason || "Failed to file grievance");
    }
  };

  if (loading) {
    return (
      <div className="grievance-page">
        <div className="grievance-box">
          <h2 className="grievance-title">File Your Grievance</h2>
          <div className="loading-message">Loading user data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grievance-page">
        <div className="grievance-box">
          <h2 className="grievance-title">File Your Grievance</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grievance-page">
      <div className="grievance-box">
        <h2 className="grievance-title">File Your Grievance</h2>
        <p className="grievance-subtext">Let us know the issue you're facing.</p>

        <form className="grievance-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            readOnly
            className="read-only-input"
          />

          <label htmlFor="description">Grievance Details</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your issue..."
          />

          {error && <div className="form-error-message">{error}</div>}

          <button type="submit" className="connect-button">
            Submit
          </button>
        </form>

        <Link to="/user-dashboard" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
};

export default FileGrievances;