import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
//import token contract
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol';
import {MyToken__factory}  from '../typechain-types/factories/contracts/ERC20Votes.sol';

require('dotenv').config();

async function main(){    
let contract: MyToken;
const signer = await ethers.getSigners();
const MyTokenFactory =new MyToken__factory(signer[0]);
contract = MyTokenFactory.attach(process.env.CONTRACT_ADDRESS ?? "");
// delegate
const tx = await contract.transfer("0x6a8431f1360dFeb6AC84Bb263D5E0DDe9648f756", ethers.utils.parseEther("5"));
const receipt = await tx.wait();
console.log("tranfer to 0x6a8431f1360dFeb6AC84Bb263D5E0DDe9648f756",await contract.balanceOf("0x6a8431f1360dFeb6AC84Bb263D5E0DDe9648f756")); 


 
// walter 0xFecb77b4C504d3b614402735E643199CeADd22D7
//   issac 0x1b5839Ae69b208457Da741D70C29D430991280Fd
//   await ballot.giveRightToVote("0xE0C760C5d1672C6d3adb07D94d1D2C82c95BBAd3");
}

main()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});