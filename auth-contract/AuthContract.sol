// AuthContract.sol
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
}