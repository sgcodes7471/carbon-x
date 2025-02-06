// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IoTCreditManager {

    // Private mapping to store device/sensor IDs and associated credit values
    mapping(string => uint256[]) private iot;

    // External function to get the credit values for a given identifier
    function getByIdentifier(string memory _identifier) public view returns (uint256[] memory) {
        return iot[_identifier];
    }

    // External function to update credits by appending a new value
    function updateCredits(uint256 _credits, string memory _identifier) public {
        // Ensure the identifier has some history or create a new entry
        require(iot[_identifier].length > 0, "Invalid Identifier");
        
        // Ensure the new credit value is different from the last one
        require(iot[_identifier][iot[_identifier].length - 1] != _credits, "Redundant action");

        // Append the new credit value
        iot[_identifier].push(_credits);
    }
    
    // Function to initialize a new identifier
    function initializeIdentifier(string memory _identifier, uint256 _initialCredit) public {
        require(iot[_identifier].length == 0, "Identifier already exists");
        iot[_identifier].push(_initialCredit);
    }

}
