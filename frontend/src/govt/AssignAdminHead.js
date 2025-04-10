import React, { useState } from 'react';
import './css/style.css';
import { useNavigate } from 'react-router-dom';

const AssignAdminHead = () => {
  const navigate = useNavigate();
  const [adminHead, setAdminHead] = useState({
    address: '',
    position: 'Municipality Head',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminHead((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Assigned Admin Head Details:', adminHead);
    alert('Admin Head assigned successfully!');
    navigate("/admin-govt-home");
  };

  return (
    <div className="assign-admin-head">
      <header className="header">
        <h1>Block-Dock</h1>
      </header>

      <div className="register-container">
        <div className="register">
          <h2>👨🏻‍✈️ Assign Admin Head</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Metamask Address:
              <input
                type="text"
                name="address"
                value={adminHead.address}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Position:
              <input
                type="text"
                name="position"
                value={adminHead.position}
                readOnly
              />
            </label>

            <div className="button-group">
              <button type="submit">Assign Admin Head</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignAdminHead;