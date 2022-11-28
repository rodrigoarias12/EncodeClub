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
const roleminter = await contract.MINTER_ROLE();
console.log(roleminter);
// grant role
const tx = await contract.grantRole(roleminter ,"0x3CDAfc99dA990D56ABEDBC0af7B4247AD2DC5a74");
const receipt = await tx.wait();
console.log("Delegate to","0x3CDAfc99dA990D56ABEDBC0af7B4247AD2DC5a74");


 
// walter 0xFecb77b4C504d3b614402735E643199CeADd22D7
//   issac 0x3CDAfc99dA990D56ABEDBC0af7B4247AD2DC5a74
//   await ballot.giveRightToVote("0xE0C760C5d1672C6d3adb07D94d1D2C82c95BBAd3");
}

main()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});