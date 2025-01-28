// deploy-direct.js
const fs = require('fs-extra');
const solc = require('solc');
const Web3 = require('web3');

async function deploy() {
    try {
        // Contract source code
        const contractSource = `
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;

        contract AuthContract {
            mapping(address => bool) public authenticatedUsers;
            mapping(address => uint256) public lastAuthTime;
            
            event UserAuthenticated(address indexed user, uint256 timestamp);
            
            function authenticate() public {
                authenticatedUsers[msg.sender] = true;
                lastAuthTime[msg.sender] = block.timestamp;
                emit UserAuthenticated(msg.sender, block.timestamp);
            }
            
            function isAuthenticated(address user) public view returns (bool) {
                return authenticatedUsers[user];
            }
            
            function getLastAuthTime(address user) public view returns (uint256) {
                return lastAuthTime[user];
            }
        }`;

        // Compile the contract
        const input = {
            language: 'Solidity',
            sources: {
                'AuthContract.sol': {
                    content: contractSource
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };

        console.log('Compiling contract...');
        const compiledContract = JSON.parse(
            solc.compile(JSON.stringify(input))
        );

        // Check for compilation errors
        if (compiledContract.errors) {
            console.error('Compilation errors:', compiledContract.errors);
            throw new Error('Contract compilation failed');
        }

        const contractBytecode = compiledContract.contracts['AuthContract.sol'].AuthContract.evm.bytecode.object;
        const contractABI = compiledContract.contracts['AuthContract.sol'].AuthContract.abi;

        // Create Web3 instance
        console.log('Connecting to local Ganache...');
        const web3Instance = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

        // Verify connection
        try {
            await web3Instance.eth.net.isListening();
            console.log('Connected to Ganache successfully');
        } catch (error) {
            throw new Error('Failed to connect to Ganache: ' + error.message);
        }

        // Get accounts
        const accounts = await web3Instance.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found in Ganache');
        }
        
        const deployer = accounts[0];
        console.log('Deploying from account:', deployer);

        // Deploy contract
        const Contract = new web3Instance.eth.Contract(contractABI);
        const deploy = Contract.deploy({
            data: '0x' + contractBytecode
        });

        console.log('Estimating gas...');
        const gas = await deploy.estimateGas();
        
        console.log('Deploying contract...');
        const contract = await deploy.send({
            from: deployer,
            gas: gas
        });

        // Generate a new account for the private key
        const newAccount = web3Instance.eth.accounts.create();
        const privateKey = newAccount.privateKey;

        // Save contract information
        const contractInfo = {
            address: contract.options.address,
            abi: contractABI,
            privateKey: privateKey,
            deployer: deployer
        };

        // Save to text file
        console.log('Saving contract information...');
        fs.writeFileSync(
            'contract-info.txt',
            `Contract Address: ${contractInfo.address}
Private Key: ${privateKey}
Deployer Address: ${contractInfo.deployer}
ABI: ${JSON.stringify(contractABI, null, 2)}
            `
        );

        // Create .env file
        fs.writeFileSync(
            '.env',
            `CONTRACT_ADDRESS=${contractInfo.address}
PRIVATE_KEY=${privateKey}
            `
        );

        console.log('Contract deployed successfully!');
        console.log('Contract address:', contractInfo.address);
        console.log('Contract information saved to contract-info.txt');
        console.log('Environment variables saved to .env');

    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment
deploy().catch(console.error);