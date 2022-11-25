import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol';
import {MyToken__factory}  from '../typechain-types/factories/contracts/ERC20Votes.sol';
import { contracts } from '../typechain-types';
//ballot contract 

require('dotenv').config();

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }
async function main(){    
const accounts=await ethers.getSigners();
//const deployer= new  ethers.wallet(process.env.PRIVATE_KEY);
const[deployer,voter,other]=accounts;
const erc20contractfactory = new MyToken__factory(accounts[0]);
const erc20contract = await erc20contractfactory.deploy();
await erc20contract.deployed();
console.log("ERC20 contract deployed to:", erc20contract.address);
console.log("balance is",await erc20contract.balanceOf(deployer.address));
//  mint tokens
const minttx = await erc20contract.mint(voter.address,TEST_MINT_TOKENS);
await minttx.wait();
console.log("balance is",await erc20contract.balanceOf(voter.address));
//get votes
const getvotestx= await erc20contract.getVotes(voter.address);
console.log("votestx",getvotestx);
//delegate votes
const delegatetx= await erc20contract.connect(voter) .delegate(voter.address);
await delegatetx.wait();
//get votes
const othergetvotestx= await erc20contract.getVotes(voter.address);
console.log("othergetvotestx",othergetvotestx);
//transfer tokens to other
const transfer =await erc20contract.connect(voter).transfer(other.address,TEST_MINT_TOKENS.div(2));
await transfer.wait();
//get votes 5
const othergetvotestx1= await erc20contract.getVotes(voter.address);
console.log("othergetvotestx",othergetvotestx1);
//delegate votes to other
const delegatetxother= await erc20contract.connect(voter) .delegate(other.address);
await delegatetxother.wait();

const currentblock=await ethers.provider.getBlock("latest");
for(let blocknumber= currentblock.number-1;blocknumber>0;blocknumber--){ 
    
    const block=await ethers.provider.getBlock(blocknumber);
    //console.log("blocknumber",blocknumber);
   // console.log("block",block);
    console.log("at block number",blocknumber,"voter has",await erc20contract.getPastVotes(voter.address,blocknumber));
}
const currentblock1=await ethers.provider.getBlock("latest");
///deploy ballot contract
//const ballotcontractfactory = new contracts.Ballot__factory(accounts[0]);

}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
}) ; // Path: lesson9\scripts\deploy.ts