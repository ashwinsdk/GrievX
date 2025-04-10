import React, { useState } from 'react';
import './css/style.css';

function SendFundPage() {
  const [receivedFunds, setReceivedFunds] = useState([
    { id: 1, source: "0x123...", amount: "1000", status: "Pending" },
    { id: 2, source: "0x456...", amount: "5000", status: "Pending" }
  ]);
  const [balance, setBalance] = useState("10000");

  const handlePay = (fundId) => {
    alert(`Payment processed for fund ID: ${fundId}`);
    // Update status in local state
    setReceivedFunds(prevFunds => 
      prevFunds.map(fund => 
        fund.id === fundId ? {...fund, status: "Paid"} : fund
      )
    );
  };

  return (
    <div className="receive-funds-container">
      <header className="header">
        <h1>Block-Dock</h1>
      </header>

      <div className="financial-summary">
        <p>Balance: {balance} RS</p>
      </div>

      <main className="content">
        <h2 className='title-h2'>Received Fund Requests</h2>

        <div>
          <table className="receive-funds-table">
            <thead>
              <tr>
                <th>Amount (in Tokens)</th>
                <th>Status</th>
                <th>Pay</th>
              </tr>
            </thead>
            <tbody>
              {receivedFunds.length > 0 ? (
                receivedFunds.map((fund) => (
                  <tr key={fund.id}>
                    <td>{fund.amount}</td>
                    <td>{fund.status}</td>
                    <td>
                      <button 
                        className='pay-button' 
                        onClick={() => handlePay(fund.id)}
                        disabled={fund.status === "Paid"}
                      >
                        {fund.status === "Paid" ? "Paid" : "Pay"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No funds found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default SendFundPage;