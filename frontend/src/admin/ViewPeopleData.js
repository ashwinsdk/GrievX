import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/style.css';

function ViewPeopleData() {
  const [people, setPeople] = useState([
    { name: 'John Doe', email: 'john@example.com', dob: '1990-01-01', mobile: '1234567890' },
    { name: 'Jane Smith', email: 'jane@example.com', dob: '1985-05-15', mobile: '9876543210' }
  ]);
  const navigate = useNavigate();

  return (
    <div className="people-data-container">
      <header className="header">
        <h1>Block-Dock</h1>
      </header>

      <main className="content">
        <h2>People Data</h2>
        <table className="people-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, index) => (
              <tr key={index}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.dob}</td>
                <td>{person.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default ViewPeopleData;