// auth-service-2/src/blockchain.js
const Web3 = require('web3');
require('dotenv').config();

class EthereumAuth {
    constructor() {
        this.web3 = new Web3(process.env.ETH_NETWORK || 'http://ganache:8545');
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.privateKey = process.env.PRIVATE_KEY;
    }

    async initialize() {
        // Contract ABI - copy this from your compiled contract JSON
        this.contractABI = [
            {
                "inputs": [],
                "name": "authenticate",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"name": "user", "type": "address"}],
                "name": "isAuthenticated",
                "outputs": [{"name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        
        this.contract = new this.web3.eth.Contract(
            this.contractABI,
            this.contractAddress
        );
    }

    async authenticateUser(userData) {
        const startTime = Date.now();
        
        try {
            const account = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
            const tx = this.contract.methods.authenticate();
            
            const gas = await tx.estimateGas({ from: account.address });
            const signedTx = await account.signTransaction({
                to: this.contractAddress,
                data: tx.encodeABI(),
                gas: gas
            });
            
            await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            
            const endTime = Date.now();
            return {
                success: true,
                executionTime: endTime - startTime,
                method: 'ethereum',
                address: account.address
            };
        } catch (error) {
            throw new Error(`Ethereum authentication failed: ${error.message}`);
        }
    }
}

module.exports = EthereumAuth;