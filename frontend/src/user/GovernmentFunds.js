import React, { useEffect, useState } from 'react';
import "./css/style.css";

function GovernmentFunds() {
    const [receivedFunds, setReceivedFunds] = useState([]);

    useEffect(() => {
        // Mock data
        const mockFunds = [
            { id: 1, source: "0x123...", amount: "₹1,000", status: "Not Paid" },
            { id: 2, source: "0x456...", amount: "₹5,000", status: "Paid" }
        ];
        setReceivedFunds(mockFunds);
    }, []);

    return (
        <div className="govfunds-page">
            <div className="govfunds-box">
                <h2 className="govfunds-title">Government Fund Requests</h2>
                <p className="govfunds-subtext">Below are the requests made by AdminHead and payment statuses from AdminGovt.</p>

                <div className="govfunds-table-wrapper">
                    <table className="govfunds-table">
                        <thead>
                            <tr>
                                <th>Requested Amount</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivedFunds.length > 0 ? (
                                receivedFunds.map((fund) => (
                                    <tr key={fund.id}>
                                        <td>{fund.amount}</td>
                                        <td>{fund.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No fund records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GovernmentFunds;
