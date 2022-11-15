// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PolyWeb3Mail {
    mapping(address => string) public addressToTablename;
    mapping(address => address[]) public allowSendEMailAddresses;

    event NewTablename (address owner, string tablename);

    function setTablename(string memory _tablename) external {
        addressToTablename[msg.sender] = _tablename;
        emit NewTablename(msg.sender, _tablename);
    }

    function addAddressToSend(address _to) external {
        allowSendEMailAddresses[msg.sender].push(_to);
    }

    function getAllAddressesCanSend(address _from) external view returns (address[] memory) {
        return allowSendEMailAddresses[_from];
    }
}