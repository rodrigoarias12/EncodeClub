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
// get votes
const votes = await contract.getVotes(signer[0].address);
console.log("Votes",votes.toString());

 
// walter 0xFecb77b4C504d3b614402735E643199CeADd22D7
//   issa 0x1b5839Ae69b208457Da741D70C29D430991280Fd
//   ("0xE0C760C5d1672C6d3adb07D94d1D2C82c95BBAd3");
}

main()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});