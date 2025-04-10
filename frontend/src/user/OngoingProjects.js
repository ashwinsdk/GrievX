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

        const allProjects = [];

        for (let i = 0; i < 10; i++) {
          try {
            const project = await contract.projects(i);
            if (project && project.pname) {
              allProjects.push({
                id: i,
                pname: project.pname,
                details: project.details,
                fundsRequired: project.fundsRequired.toString(), // Keep as WEI string
                fundsAllocated: project.fundsAllocated.toString(), // Keep as WEI string
                status: project.status,
                adminHead: project.adminHead,
                projectManager: project.projectManager
              });
            }
          } catch (e) {
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

  const formatStatus = (status) => {
    switch (status) {
      case "PLANNING": return "Planning";
      case "ONGOING": return "In Progress";
      case "COMPLETED": return "Completed";
      default: return status;
    }
  };

  const formatWei = (wei) => {
    return Number(wei).toLocaleString(); // Format WEI with commas
  };

  if (loading) {
    return <div className="projects-page"><h2>Loading Projects...</h2></div>;
  }

  if (error) {
    return <div className="projects-page"><h2>Error</h2><p>{error}</p></div>;
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
                <th>Funds Required (WEI)</th>
                <th>Funds Allocated (WEI)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.pname}</td>
                    <td>{project.details}</td>
                    <td>{formatWei(project.fundsRequired)}</td>
                    <td>{formatWei(project.fundsAllocated)}</td>
                    <td>{formatStatus(project.status)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No projects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OngoingProjects;