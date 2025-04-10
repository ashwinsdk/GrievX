import React, { useState } from 'react';
import './css/style.css';

const FundAllocationPage = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Road Repair', details: 'Main street renovation', total: '5000', status: 'INPROGRESS' },
    { id: 2, name: 'Park Development', details: 'Central park renovation', total: '3000', status: 'PLANNING' }
  ]);
  const [newProject, setNewProject] = useState({ name: '', details: '', total: '' });
  const [balance, setBalance] = useState('10000');

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.details || !newProject.total) {
      alert('Please fill all fields before creating a project.');
      return;
    }

    const newId = projects.length + 1;
    setProjects([...projects, {
      id: newId,
      name: newProject.name,
      details: newProject.details,
      total: newProject.total,
      status: 'PLANNING'
    }]);
    setNewProject({ name: '', details: '', total: '' });
    alert('Project created successfully!');
  };

  const handleEditStatus = (projectId, newStatus) => {
    setProjects(projects.map(project => 
      project.id === projectId ? {...project, status: newStatus} : project
    ));
    alert('Project status updated successfully!');
  };

  return (
    <div className="fund-allocation-container">
      <header className="header">
        <h1>Block-Dock</h1>
      </header>

      <div className="financial-summary">
        <p>Balance: {balance}</p>
      </div>

      <main className="content">
        <h2>Fund Allocation</h2>

        <div className="new-project-form">
          <h3>Add New Project</h3>
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            placeholder="Project Name"
          />
          <input
            type="text"
            value={newProject.details}
            onChange={(e) => setNewProject({ ...newProject, details: e.target.value })}
            placeholder="Details"
          />
          <input
            type="number"
            value={newProject.total}
            onChange={(e) => setNewProject({ ...newProject, total: e.target.value })}
            placeholder="Amount (in Tokens)"
          />
          <button onClick={handleCreateProject}>Create Project</button>
        </div>

        <div className="projects-list">
          <h3>Ongoing Projects</h3>
          <table className="fund-allocation-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Details</th>
                <th>Amount (in Tokens)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.details}</td>
                  <td>{project.total}</td>
                  <td>{project.status}</td>
                  <td>
                    {project.status !== 'DONE' && (
                      <button onClick={() => handleEditStatus(project.id, 'DONE')}>
                        Mark as Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default FundAllocationPage;