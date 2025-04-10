import React, { useState, useEffect } from 'react';
import './css/style.css';
import { Link } from 'react-router-dom';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function SendFundPage() {
  const [projects, setProjects] = useState([]);
  const [balance, setBalance] = useState("0");
  const [contract, setContract] = useState(null);
  const [isAdminGovt, setIsAdminGovt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
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

      // Check if user is adminGovt
      const adminGovt = await instance.adminGovt();
      const currentAddress = await signer.getAddress();
      setIsAdminGovt(currentAddress.toLowerCase() === adminGovt.toLowerCase());

      await fetchProjects(instance);
      await fetchBalance(instance);
    } catch (err) {
      console.error("Error initializing contract:", err);
      alert("Failed to connect to contract");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (contractInstance) => {
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
            fundsRequired: project.fundsRequired.toString(), // Store as wei string
            fundsAllocated: project.fundsAllocated.toString(), // Store as wei string
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
  };

  const fetchBalance = async (contractInstance) => {
    try {
      const rawBalance = await contractInstance.getContractBalance();
      setBalance(rawBalance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleFundProject = async (projectId) => {
    try {
      const amount = prompt(`Enter funding amount in wei for project ${projectId}:`);
      if (!amount || isNaN(amount)) return;

      setLoading(true);
      const tx = await contract.fundProject(
        projectId,
        amount // Directly use wei value
      );
      await tx.wait();
      alert("Project funded successfully!");
      await fetchProjects(contract);
      await fetchBalance(contract);
    } catch (err) {
      console.error("Error funding project:", err);
      alert(`Failed to fund project: ${err.reason || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper fade-in">
        <h1 className="logo">GrievX</h1>
        <div className="section-title">Loading...</div>
      </div>
    );
  }

  if (!isAdminGovt) {
    return (
      <div className="page-wrapper fade-in">
        <h1 className="logo">GrievX</h1>
        <div className="section-title">Access Denied</div>
        <p>Only Government Admin can access this page</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-in">
      <h1 className="logo">GrievX</h1>

      <div className="section-title">Government Fund Management</div>

      <div className="financial-summary">
        <p>Available Contract Balance: <strong>{balance} WEI</strong></p>
      </div>

      <div className="fund-table-wrapper">
        <table className="fund-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Required Funds (wei)</th>
              <th>Allocated Funds (wei)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.fundsRequired}</td>
                  <td>{project.fundsAllocated}</td>
                  <td>
                    <span className={`status-badge ${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    {project.status === "PLANNING" && (
                      <button
                        className="connect-button"
                        onClick={() => handleFundProject(project.id)}
                      >
                        Fund Project
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No projects available for funding.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Link to="/admin-govt-home" className="back-home">← Back to Home</Link>
    </div>
  );
}

export default SendFundPage;