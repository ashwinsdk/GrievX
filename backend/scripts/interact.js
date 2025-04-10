const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    const contractAddress = "0x7Ea1cB94653bb0623C62F293dd864fea883369B2";

    const contractPath = path.resolve(__dirname, '../artifacts/contracts/GrievX.sol/GrievanceSystem.json');
    const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

    const contract = new ethers.Contract(contractAddress, contractJSON.abi, signer);

    try {
        const adminGovt = await contract.adminGovt();
        const taxAmount = await contract.fixedTaxAmount();

        console.log("Admin Govt Address:", adminGovt);
        console.log("Fixed Tax Amount (wei):", taxAmount.toString());

    } catch (error) {
        console.error("Error calling contract function:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
