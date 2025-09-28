# GrievX

Blockchain-powered transparency and trust in urban governance.

[![YouTube Demo](https://img.shields.io/badge/Demo-YouTube-red)](https://youtu.be/HXHmHce6-ic)
[![Live Deployment](https://img.shields.io/badge/Visit-GrievX-green)](https://grievx.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


<img width="1470" alt="Index" src="https://github.com/user-attachments/assets/03b75137-fac1-44da-8b7d-7a7c02eb8f5a" />

---

## Introduction

GrievX solves the critical issues of transparency, trust, and efficiency in urban governance. Traditionally, citizens have little to no visibility into how their taxes are used, grievances often get lost in bureaucratic delays, and public funds intended for development projects are at risk of misuse and corruption. GrievX addresses these challenges by using blockchain technology to create a transparent, tamper-proof system where tax payments, grievance filings, and project fund allocations are recorded immutably on-chain. By automating processes through smart contracts, GrievX ensures that grievances are efficiently handled, funds are securely distributed, and every transaction remains publicly verifiable, restoring citizen trust and holding municipal bodies accountable.

---

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- MetaMask wallet
- Ethereum testnet account (Sepolia)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ashwinsdk/GrievX.git
   cd GrievX
   ```

2. Backend Setup:
   ```bash
   cd backend
   npm install
   npx hardhat compile
   ```
   To deploy the contract (optional, already deployed):
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. Frontend Setup:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

### Usage

- Open your browser to `http://localhost:3000`
- Connect your MetaMask to Sepolia testnet
- Register as a user, pay taxes, file grievances, etc.
- For admin roles, use specific addresses as per the contract.

---

## Challenges I Ran Into

While building GrievX, one of the major challenges I faced was designing the tax payment system to ensure that users could not bypass or exploit it. Initially, users could pay the tax once and then indefinitely file grievances without any renewal mechanism, which did not reflect real-world annual tax systems. To overcome this, I realized the need for a tax period reset mechanism based on timestamps, although I chose to keep it simple for the current version. Another hurdle was managing permissions securely within the smart contract to ensure that only authorized roles like the Municipal Head and Government Officer could perform sensitive operations such as project creation and fund disbursement. I overcame this by implementing strict `modifier` functions like `onlyAdminGovt` and `onlyAdminHead` to guard important actions. Gas optimization was another learning curve; I had to restructure how data was stored and retrieved, using mappings instead of arrays, and emitting events instead of storing excess on-chain data. Through careful debugging, researching Solidity best practices, and iterative testing on the Sepolia testnet, I was able to overcome these hurdles and strengthen the system.

---

## Technologies I Used

Solidity, Hardhat, React, JavaScript, Node.js, Ethers.js, MetaMask, Sepolia Testnet, Ethereum Blockchain, Alchemy (for node provider), Git, GitHub.

## Project Structure

- `backend/`: Contains the Solidity smart contracts, Hardhat configuration, and deployment scripts.
- `frontend/`: React application for the user interface.
- `docs/`: Additional documentation.
- `LICENSE.md`: MIT License.

---

## Deployment

Frontend Deployment: [Check out on netlify!](https://grievx.netlify.app/)  
Smart Contract Network: [Sepolia Testnet](https://sepolia.etherscan.io/address/0x7Ea1cB94653bb0623C62F293dd864fea883369B2)  
Demo Video: [Watch on YouTube](https://youtu.be/HXHmHce6-ic)

---

## Future Enhancements

- Integration with IPFS to store larger grievance documents off-chain.
- DAO Governance system for citizen-based project approvals.
- Zero-Knowledge Proofs (ZKPs) for verifying tax compliance without exposing user details.

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


