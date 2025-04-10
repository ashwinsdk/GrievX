import React, { useEffect, useState } from 'react';
import "./css/style.css";
import contractABI from '../contracts/GrievanceSystem.json';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

function PayTaxes() {
    const [taxAmount, setTaxAmount] = useState("0");
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        async function init() {
            if (window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    setAccount(address);

                    const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
                    setContract(contract);

                    // Check if user is registered
                    const user = await contract.users(address);
                    if (user.isRegistered) {
                        setCurrentUser({
                            address: address,
                            taxPaid: ethers.formatEther(user.taxPaid),
                            taxPaidStatus: user.taxPaidStatus
                        });
                    }

                    // Get tax amount
                    const amount = await contract.fixedTaxAmount();
                    setTaxAmount(amount);

                    // Get payment history
                    await loadPaymentHistory(contract, address);
                } catch (error) {
                    console.error("Error initializing contract:", error);
                }
            }
        }

        init();
    }, []);

    async function loadPaymentHistory(contract, userAddress) {
        try {
            const filter = contract.filters.TaxPaid(userAddress);
            const events = await contract.queryFilter(filter);

            const history = await Promise.all(events.map(async (event) => {
                const tx = await event.getTransaction();
                const block = await tx.getBlock();
                return {
                    txHash: event.transactionHash,
                    amount: event.args.amount,
                    timestamp: new Date(block.timestamp * 1000).toLocaleString()
                };
            }));

            setPaymentHistory(history);
        } catch (error) {
            console.error("Error loading payment history:", error);
        }
    }

    async function handlePayTax() {
        if (!contract || !currentUser) return;

        try {
            const tx = await contract.payTax({
                value: ethers.parseEther(taxAmount)
            });

            await tx.wait();

            // Refresh user and history
            const user = await contract.users(account);
            setCurrentUser({
                address: account,
                taxPaid: ethers.formatEther(user.taxPaid),
                taxPaidStatus: user.taxPaidStatus
            });

            await loadPaymentHistory(contract, account);
            alert("Tax payment successful!");
        } catch (error) {
            console.error("Error paying tax:", error);
            alert(`Payment failed: ${error.message}`);
        }
    }

    return (
        <div className="govfunds-page">
            <div className="govfunds-box">
                <h2 className="govfunds-title">Tax Payment System</h2>

                {/* Tax Payment Section */}
                <div className="tax-payment-section" style={{
                    marginBottom: '40px',
                    padding: '20px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '10px'
                }}>
                    <h3 style={{ color: '#39FF14', marginBottom: '15px' }}>Pay Your Taxes</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>
                            Current Tax Amount:
                        </label>
                        <input
                            type="text"
                            value={`${taxAmount} WEI`}
                            readOnly
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#222',
                                color: '#fff'
                            }}
                        />
                    </div>

                    {currentUser?.taxPaidStatus ? (
                        <p style={{ color: '#39FF14' }}>You have already paid taxes for this period.</p>
                    ) : (
                        <button
                            onClick={handlePayTax}
                            className="connect-button"
                            style={{ marginTop: '10px' }}
                        >
                            Pay Tax ({taxAmount} WEI)
                        </button>
                    )}
                </div>

                {/* Payment History Section */}
                <div className="payment-history-section">
                    <h3 style={{ color: '#39FF14', marginBottom: '15px' }}>Your Payment History</h3>

                    <div className="govfunds-table-wrapper">
                        <table className="govfunds-table">
                            <thead>
                                <tr>
                                    <th>Transaction Hash</th>
                                    <th>Amount (WEI)</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.length > 0 ? (
                                    paymentHistory.map((payment, index) => (
                                        <tr key={index}>
                                            <td>
                                                <a
                                                    href={`https://sepolia.etherscan.io/tx/${payment.txHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#39FF14' }}
                                                >
                                                    {`${payment.txHash.substring(0, 6)}...${payment.txHash.substring(payment.txHash.length - 4)}`}
                                                </a>
                                            </td>
                                            <td>{payment.amount}</td>
                                            <td>{payment.timestamp}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>
                                            No tax payments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Link to="/user-dashboard" className="back-home">← Back to Home</Link>
            </div>
        </div>
    );
}

export default PayTaxes;