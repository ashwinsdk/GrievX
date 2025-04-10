import React, { useState, useEffect } from 'react';
import './css/style.css';
import contractABI from './../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function AssignTaxes() {
    const [taxAmount, setTaxAmount] = useState("0");
    const [taxPayments, setTaxPayments] = useState([]);
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

            await fetchTaxAmount(instance);
            await fetchTaxPayments(instance);
        } catch (err) {
            console.error("Error initializing contract:", err);
            alert("Failed to connect to contract");
        } finally {
            setLoading(false);
        }
    };

    const fetchTaxAmount = async (contractInstance) => {
        try {
            const amount = await contractInstance.fixedTaxAmount();
            setTaxAmount(amount.toString()); // Store in wei
        } catch (err) {
            console.error("Error fetching tax amount:", err);
        }
    };

    const fetchTaxPayments = async (contractInstance) => {
        try {
            const [addresses, amounts, statuses] = await contractInstance.viewTaxPayments();
            const payments = addresses.map((address, index) => ({
                address,
                amount: amounts[index].toString(), // Store in wei
                paid: statuses[index]
            }));
            setTaxPayments(payments);
        } catch (err) {
            console.error("Error fetching tax payments:", err);
        }
    };

    const handleSetTaxAmount = async () => {
        try {
            const newAmount = prompt("Enter new tax amount in wei:", taxAmount);
            if (!newAmount || isNaN(newAmount)) return;

            // Validate wei amount (must be integer)
            if (!Number.isInteger(Number(newAmount))) {
                throw new Error("Tax amount must be a whole number in wei");
            }

            setLoading(true);
            const tx = await contract.setTaxAmount(newAmount);
            await tx.wait();
            alert("Tax amount updated successfully!");
            await fetchTaxAmount(contract);
        } catch (err) {
            console.error("Error setting tax amount:", err);
            alert(`Failed to set tax amount: ${err.reason || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format wei for display
    const formatWei = (weiAmount) => {
        return ethers.formatUnits(weiAmount, "wei") + " wei";
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

            <div className="section-title">Tax Management (Wei)</div>

            <div className="tax-controls">
                <div className="tax-amount-display">
                    Current Tax Amount: <strong>{formatWei(taxAmount)}</strong>
                    <div className="eth-conversion">
                        (~{ethers.formatEther(taxAmount)} ETH)
                    </div>
                </div><br />
                <button
                    className="connect-button"
                    onClick={handleSetTaxAmount}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Set Tax Amount'}
                </button>
            </div>

            <div className="tax-payments-section">
                <h3>Tax Payment Records</h3>
                <div className="fund-table-wrapper">
                    <table className="fund-table">
                        <thead>
                            <tr>
                                <th>User Address</th>
                                <th>Amount Paid</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taxPayments.length > 0 ? (
                                taxPayments.map((payment, index) => (
                                    <tr key={index}>
                                        <td className="address-cell">
                                            {`${payment.address.substring(0, 6)}...${payment.address.substring(payment.address.length - 4)}`}
                                        </td>
                                        <td>
                                            {formatWei(payment.amount)}
                                            <div className="eth-conversion">
                                                (~{ethers.formatEther(payment.amount)} ETH)
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${payment.paid ? 'paid' : 'pending'}`}>
                                                {payment.paid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No tax payments recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Link to="/admin-govt-home" className="back-home">← Back to Home</Link>
        </div>
    );
}

export default AssignTaxes;