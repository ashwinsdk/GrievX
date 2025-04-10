import React, { useState, useEffect } from 'react';
import './css/style.css';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function ViewAllGrievance() {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function fetchGrievances() {
            try {
                if (!window.ethereum) {
                    throw new Error("Please install MetaMask to view grievances");
                }

                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

                // Check admin status
                const [adminGovt, adminHead] = await Promise.all([
                    contract.adminGovt(),
                    contract.adminHead()
                ]);

                const currentAddress = await signer.getAddress();
                const userIsAdmin = currentAddress.toLowerCase() === adminGovt.toLowerCase() ||
                    currentAddress.toLowerCase() === adminHead.toLowerCase();

                setIsAdmin(userIsAdmin);

                // Get grievances based on user role
                let grievancesData;
                if (userIsAdmin) {
                    grievancesData = await contract.viewAllGrievances();
                } else {
                    grievancesData = await contract.viewMyGrievances();
                }

                // Format grievance data
                const formattedGrievances = grievancesData.map((grievance, index) => ({
                    id: index,
                    name: grievance.name,
                    details: grievance.details,
                    status: grievance.status,
                    timestamp: new Date(Number(grievance.timestamp) * 1000).toLocaleString(),
                    user: grievance.user
                }));

                setGrievances(formattedGrievances);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching grievances:", err);
                setError(err.reason || err.message);
                setLoading(false);
            }
        }

        fetchGrievances();
    }, []);

    if (loading) {
        return (
            <div className="projects-page">
                <div className="projects-box">
                    <h2 className="projects-title">Loading Grievances...</h2>
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
                <h2 className="projects-title">
                    {isAdmin ? 'All Grievances' : 'My Grievances'}
                </h2>
                <p className="projects-subtext">
                    {isAdmin ? 'View and manage all grievances' : 'Track your submitted grievances'}
                </p>

                <div className="projects-table-wrapper">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Submitted On</th>
                                {isAdmin && <th>Submitted By</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {grievances.length > 0 ? (
                                grievances.map((grievance, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{grievance.name}</td>
                                        <td>{grievance.details}</td>
                                        <td>
                                            <span className={`status-badge ${grievance.status.toLowerCase()}`}>
                                                {grievance.status}
                                            </span>
                                        </td>
                                        <td>{grievance.timestamp}</td>
                                        {isAdmin && (
                                            <td className="address-cell">
                                                {`${grievance.user.substring(0, 6)}...${grievance.user.substring(grievance.user.length - 4)}`}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5}>No grievances found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewAllGrievance;