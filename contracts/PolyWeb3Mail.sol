// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PolyWeb3Mail {
    mapping(address => string) public addressToTablename;

    event NewTablename (address owner, string tablename);

    function setTablename(string memory _tablename) external {
        addressToTablename[msg.sender] = _tablename;
        emit NewTablename(msg.sender, _tablename);
    }
}