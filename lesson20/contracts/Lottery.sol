// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./LotteryToken.sol";

contract Lottery  is Ownable 
{
   LotteryToken public paymentToken;
   bool public betsOpen ;
   uint256 public betsClosingTime;
   uint256 public purchaseRatio;
   uint256 public betPrice;
   uint256 public betfree;
   uint256 public ownerPool; 
   uint256 public prizePool;
   address[] _slots;
    mapping(address => uint256) public bets;
   constructor(uint256 _purchaseRatio2, string memory _name, string memory _symbol) {
       purchaseRatio = _purchaseRatio2;
       paymentToken = new LotteryToken(_name, _symbol);
   }

  modifier whenBetsOpen() {
    require(betsOpen, "Bets are not open");
    _;
  }
  function bet() public whenBetsOpen {
    ownerPool+=betFree;
    prizePool+=betPrice;
    // register the player 
    slots.push(msg.sender);
    paymentToken.transferFrom(msg.sender, address(this), betPrice+betfree);
  }
  funtion closeLottery() public  {
    require(betsOpen, "Bets are not open");
    require(block.timestamp > betsClosingTime, "Too soon to close");
    if(_slots.length>0){
      uint256 winnerIndex = random() % _slots.length;
      address winner = _slots[winnerIndex];
      paymentToken.transfer(winner, prizePool);
    }

    //pick a winner
    betsOpen = false;
    betsClosingTime = block.timestamp;
  }
  function openBets(uint256 closingTime ) external onlyOwner {
    require(betsClosingTime > block.timestamp, "Lottery: closing time must be in the future"); 
    require(!betsOpen, "Lottery: bets are already open");
    betsClosingTime= closingTime;
    betsOpen = true;
  }
  function purchaseTokens() external payable {
    require(betsOpen, "Lottery: bets are not open");
    require(block.timestamp < betsClosingTime, "Lottery: bets are closed");
    require(msg.value > 0, "Lottery: you must send some ether");
    
  }

}