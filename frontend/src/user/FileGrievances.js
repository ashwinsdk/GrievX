import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/style.css';

const FileGrievances = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Your grievance has been filed.`);
    navigate("/user-dashboard");
  };

  return (
    <div className="grievance-page">
      <div className="grievance-box">
        <h2 className="grievance-title">File Your Grievance</h2>
        <p className="grievance-subtext">Let us know the issue you’re facing.</p>
        
        <form className="grievance-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
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

          <button type="submit" className="connect-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FileGrievances;
