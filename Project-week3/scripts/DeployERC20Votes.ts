import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
//import token contract
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol';
import {MyToken__factory}  from '../typechain-types/factories/contracts/ERC20Votes.sol';

require('dotenv').config();

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");
const PROPOSALS = ["vanilla", "chocolate", "strawberry"];
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }
async function main(){    
  //connect with the provider alchemy 
//   const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

// //const provider = ethers.getDefaultProvider("goerli");
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
// const signer = wallet.connect(alchemyProvider);
// const balanceBN = await signer.getBalance();
// console.log(`Connected to the account of address ${signer.address}`);
// console.log(`The balance of this account is ${balanceBN.toString()} Wei`);

const erc20contractfactory = await ethers.getContractFactory("MyToken");
const erc20contract = await erc20contractfactory.deploy();
await erc20contract.deployed();
console.log("ERC20 contract deployed to:", erc20contract.address);



//   //give voting rights
//   await ballot.giveRightToVote("0xFecb77b4C504d3b614402735E643199CeADd22D7");
//   await ballot.giveRightToVote("0x1b5839Ae69b208457Da741D70C29D430991280Fd");
//   await ballot.giveRightToVote("0xE0C760C5d1672C6d3adb07D94d1D2C82c95BBAd3");
}

main()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});