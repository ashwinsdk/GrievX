import React, { useEffect, useState } from 'react';
import './css/style.css';

function AllGrievances() {
    const [grievances, setGrievances] = useState([]);

    useEffect(() => {
        // Mock data
        const mockGrievances = [
            { user: '0x123...', name: 'John Doe', details: 'Street light not working', status: 'Pending' },
            { user: '0x456...', name: 'Jane Smith', details: 'Garbage not collected', status: 'Resolved' }
        ];
        setGrievances(mockGrievances);
    }, []);

    return (
        <div className="page-wrapper fade-in">
            <h1 className="logo">GrievX</h1>

            <div className="card-box">
                <h2 className="section-title">All Grievances</h2>
                <p className="section-subtitle">Below is the list of all filed grievances.</p>

                <div className="custom-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Name</th>
                                <th>Details</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grievances.length > 0 ? (
                                grievances.map((grievance, index) => (
                                    <tr key={index}>
                                        <td>{grievance.user || 'N/A'}</td>
                                        <td>{grievance.name || 'N/A'}</td>
                                        <td>{grievance.details || 'N/A'}</td>
                                        <td>{grievance.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>No grievances found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AllGrievances;
