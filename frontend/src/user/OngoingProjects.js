import React, { useEffect, useState } from 'react';
import './css/style.css';
import { ethers } from 'ethers';
import contractABI from '../contracts/GrievanceSystem.json';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function OngoingProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask to view projects");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);

        // Get project count (would need to add this function to your contract)
        // const projectCount = await contract.projectCount();

        // For now, we'll assume we can get all projects (you might need to track IDs)
        const allProjects = [];

        // This is a temporary solution - in production you should track project IDs
        // or implement a proper counter in your contract
        for (let i = 0; i < 10; i++) { // Check first 10 possible projects
          try {
            const project = await contract.projects(i);
            if (project && project.pname) { // Simple check if project exists
              allProjects.push({
                id: i,
                pname: project.pname,
                details: project.details,
                fundsRequired: ethers.formatEther(project.fundsRequired),
                fundsAllocated: ethers.formatEther(project.fundsAllocated),
                status: project.status,
                adminHead: project.adminHead,
                projectManager: project.projectManager
              });
            }
          } catch (e) {
            // Likely reached end of projects
            break;
          }
        }

        setProjects(allProjects);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Helper function to format status for display
  const formatStatus = (status) => {
    switch (status) {
      case "PLANNING": return "Planning";
      case "ONGOING": return "In Progress";
      case "COMPLETED": return "Completed";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="projects-page">
        <div className="projects-box">
          <h2 className="projects-title">Loading Projects...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div className="projects-box">
          <h2 className="projects-title">Error</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-box">
        <h2 className="projects-title">Municipal Projects</h2>
        <p className="projects-subtext">Track the progress and funding of active initiatives.</p>

        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Funds Required (ETH)</th>
                <th>Funds Allocated (ETH)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.pname}</td>
                    <td>{project.details}</td>
                    <td>{project.fundsRequired}</td>
                    <td>{project.fundsAllocated}</td>
                    <td>{formatStatus(project.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OngoingProjects;