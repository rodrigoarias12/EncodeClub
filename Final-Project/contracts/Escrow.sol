/// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Escrow is AccessControl {
    //TODO add the auction struct
    struct Auction {
        uint id;
        uint minAmount;
        uint currentAmount;
        string tittle;
        string description;
        address payable owner;
        bool active;
        address payable highestBidder;
        uint256  closingTime;

    } 
    Auction [] public auctions;
    constructor() {
        //TODO add the code to initialize the contract
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);


    }
    function PublishAuction(uint minAmount, string calldata tittle,string calldata description) public
    {
        //TODO add the code to publish a new auction
        Auction memory newAuction = Auction(auctions.length, minAmount, tittle, description, msg.sender, true, block.timestamp + 1 days);
        auctions.push(newAuction);        
    }
    function Close(uint id) public
    {
        //TODO add the code to close an auction
        Auction storage auction = auctions[id];
        require(auction.owner == msg.sender, "Only the owner can close the auction");
        auction.active = false;
    }
    function Bid(uint id) public payable
    {
        //TODO add the code to bid on an auction
        Auction storage auction = auctions[id];
        require(auction.active == true, "The auction is not active");
        require(msg.value >= auction.minAmount, "The amount is not enough");
        require(block.timestamp < auction.closingTime, "The auction is closed");
        //return the money to the previous highest bidder
        payable(auction.highestBidder).transfer(auction.currentAmount);
        auction.currentAmount = msg.value;
        auction.highestBidder = payable(msg.sender);

    }
    function GetAuctions() public view returns (Auction[] memory)
    {
        //TODO add the code to get all the auctions
        return auctions;
    }
    function GetAuction(uint id) public view returns (Auction memory)
    {
        //TODO add the code to get a specific auction
        return auctions[id];
    }



}