import React, { useState, useEffect, useCallback } from 'react';
import './css/style.css';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

const FundAllocationPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    details: '',
    fundsRequired: '',
    projectManager: '',
    relatedGrievances: []
  });
  const [contract, setContract] = useState(null);
  const [isAdminHead, setIsAdminHead] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ projectId: null, newStatus: '' });

  const fetchProjects = useCallback(async (contractInstance) => {
    try {
      const allProjects = [];
      let i = 0;

      while (true) {
        try {
          const project = await contractInstance.projects(i);
          if (project.pname === "") break;

          allProjects.push({
            id: i,
            name: project.pname,
            details: project.details,
            fundsRequired: project.fundsRequired.toString(),
            fundsAllocated: project.fundsAllocated.toString(),
            status: project.status,
            manager: project.projectManager
          });
          i++;
        } catch (err) {
          break;
        }
      }

      setProjects(allProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, []);

  const fetchGrievances = useCallback(async (contractInstance) => {
    try {
      const allGrievances = await contractInstance.viewAllGrievances();
      setGrievances(allGrievances.map((g, i) => ({ id: i, ...g })));
    } catch (err) {
      console.error("Error fetching grievances:", err);
    }
  }, []);

  const initializeContract = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const instance = new ethers.Contract(contractAddress, contractABI.abi, signer);
      setContract(instance);

      const adminHead = await instance.adminHead();
      const currentAddress = await signer.getAddress();
      setIsAdminHead(currentAddress.toLowerCase() === adminHead.toLowerCase());

      await fetchProjects(instance);
      await fetchGrievances(instance);
    } catch (err) {
      console.error("Error initializing contract:", err);
      alert("Failed to connect to contract");
    } finally {
      setLoading(false);
    }
  }, [fetchProjects, fetchGrievances]);

  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  const handleCreateProject = async () => {
    const { name, details, fundsRequired, projectManager, relatedGrievances } = newProject;
    if (!name || !details || !fundsRequired || !projectManager) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!/^\d+$/.test(fundsRequired)) {
      alert("Please enter a valid WEI amount (numbers only)");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.createProject(
        name,
        details,
        fundsRequired,
        projectManager,
        relatedGrievances
      );
      await tx.wait();
      alert("Project created successfully!");
      setNewProject({
        name: '',
        details: '',
        fundsRequired: '',
        projectManager: '',
        relatedGrievances: []
      });
      await fetchProjects(contract);
    } catch (err) {
      console.error("Error creating project:", err);
      alert(`Failed to create project: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (statusUpdate.projectId === null || !statusUpdate.newStatus) {
      alert("Please select a project and status");
      return;
    }

    try {
      setLoading(true);
      let tx;
      if (statusUpdate.newStatus === "COMPLETED") {
        tx = await contract.completeProject(statusUpdate.projectId);
      } else {
        // For other status changes you might need to add more functions in your contract
        alert("Only completion status can be updated currently");
        return;
      }

      await tx.wait();
      alert("Project status updated successfully!");
      setStatusUpdate({ projectId: null, newStatus: '' });
      await fetchProjects(contract);
    } catch (err) {
      console.error("Error updating project status:", err);
      alert(`Failed to update status: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="fund-allocation-page"><h2 className="fund-title">Loading...</h2></div>;
  }

  if (!isAdminHead) {
    return (
      <div className="fund-allocation-page">
        <h2 className="fund-title">Access Denied</h2>
        <p>Only Municipal Head can access this page</p>
      </div>
    );
  }

  return (
    <div className="fund-allocation-page">
      <div className="fund-box">
        <h2 className="fund-title">Municipal Project Management</h2>
        <p className="fund-subtext">Create and manage municipal projects with blockchain transparency</p>

        <div className="new-project-form">
          <h3>Create New Project</h3>
          <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Project Name" className="form-input" />
          <textarea value={newProject.details} onChange={(e) => setNewProject({ ...newProject, details: e.target.value })} placeholder="Project Details" className="form-textarea" />
          <input
            type="text"
            value={newProject.fundsRequired}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setNewProject({ ...newProject, fundsRequired: value });
            }}
            placeholder="Funds Required (in WEI)"
            className="form-input"
          />
          <input type="text" value={newProject.projectManager} onChange={(e) => setNewProject({ ...newProject, projectManager: e.target.value })} placeholder="Project Manager Address" className="form-input" />
          <select multiple onChange={(e) => {
            const selected = [...e.target.options].filter(opt => opt.selected).map(opt => parseInt(opt.value));
            setNewProject({ ...newProject, relatedGrievances: selected });
          }} className="form-multiselect">
            {grievances.map(grievance => (
              <option key={grievance.id} value={grievance.id}>
                Grievance #{grievance.id}: {grievance.details?.substring(0, 50)}...
              </option>
            ))}
          </select>
          <button onClick={handleCreateProject} className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>

        <div className="project-list">
          <h3>Active Projects</h3>

          {/* Status Update Form (shown when a project is selected) */}
          {statusUpdate.projectId !== null && (
            <div className="status-update-form">
              <select
                value={statusUpdate.newStatus}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, newStatus: e.target.value })}
                className="form-select"
              >
                <option value="">Select Status</option>
                <option value="COMPLETED">Mark as Completed</option>
              </select>
              <button onClick={handleUpdateStatus} className="action-button">
                Update Status
              </button>
              <button
                onClick={() => setStatusUpdate({ projectId: null, newStatus: '' })}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          )}

          <table className="fund-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Details</th>
                <th>Required (WEI)</th>
                <th>Allocated (WEI)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? projects.map(project => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.details}</td>
                  <td>{Number(project.fundsRequired).toLocaleString()}</td>
                  <td>{Number(project.fundsAllocated).toLocaleString()}</td>
                  <td><span className={`status-badge ${project.status.toLowerCase()}`}>{project.status}</span></td>
                  <td>
                    {project.status === 'ONGOING' && (
                      <button
                        onClick={() => setStatusUpdate({ projectId: project.id, newStatus: '' })}
                        className="action-button"
                      >
                        Update Status
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6">No projects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Link to="/admin-head-home" className="back-home">← Back to Home</Link>
      </div>
    </div>
  );
};

export default FundAllocationPage;