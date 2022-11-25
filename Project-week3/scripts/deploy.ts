import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
//import token contract
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol/';
import {MyToken__factory}  from '../typechain-types/factories/contracts/ERC20Votes.sol/';
//import ballot contract
import {Ballot} from '../typechain-types/contracts/TokenizedBallot.sol';
import {Ballot__factory} from '../typechain-types/factories/contracts/TokenizedBallot.sol';
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
const[deployer,voter,other,other1,other2]=accounts;
const erc20contractfactory = new MyToken__factory(accounts[0]);
const erc20contract = await erc20contractfactory.deploy();
await erc20contract.deployed();
console.log("ERC20 contract deployed to:", erc20contract.address);
console.log("balance is",await erc20contract.balanceOf(deployer.address));

//  mint tokens to voter
const minttx = await erc20contract.mint(voter.address,TEST_MINT_TOKENS);
await minttx.wait();
//delegate votes
const delegatetx= await erc20contract.connect(voter).delegate(voter.address);
await delegatetx.wait();

//transfer tokens to other2
const transfer1 =await erc20contract.connect(voter).transfer(other2.address,TEST_MINT_TOKENS.div(2));
await transfer1.wait();
//delegate votes to other2
const delegatetxother22= await erc20contract.connect(voter).delegate(other2.address);
await delegatetxother22.wait();


///  mint tokens to other
const otherminttx = await erc20contract.mint(other.address,TEST_MINT_TOKENS);
await otherminttx.wait();
//delegate votes
const otherdelegatetx1= await erc20contract.connect(other).delegate(other.address);
await otherdelegatetx1.wait();

///  mint tokens to other1
const other1minttx = await erc20contract.mint(other1.address,TEST_MINT_TOKENS);
await other1minttx.wait();
//delegate votes
const other1delegatetx= await erc20contract.connect(other1).delegate(other1.address);
await other1delegatetx.wait();
//delegate votes
const other1delegatetx1= await erc20contract.connect(other1).delegate(other1.address);
await other1delegatetx1.wait();

const currentblock=await ethers.provider.getBlock("latest");

console.log("voter has voter",await erc20contract.getPastVotes(voter.address,currentblock.number-1));
console.log("other2 has ",await erc20contract.getPastVotes(other2.address,currentblock.number-1));
console.log("other has",await erc20contract.getPastVotes(other.address,currentblock.number-1));
console.log("other1 has ",await erc20contract.getPastVotes(other1.address,currentblock.number-1));

// for(let blocknumber= currentblock.number-1;blocknumber>0;blocknumber--){ 
    
//     console.log("at block number",blocknumber,"voter has",await erc20contract.getPastVotes(other.address,blocknumber));
// }
//deploy ballot contract
const ballotcontractfactory = new Ballot__factory(accounts[0]);
const ballotcontract = await ballotcontractfactory.deploy(convertStringArrayToBytes32(PROPOSALS),erc20contract.address,currentblock.number);
await ballotcontract.deployed();
console.log("Ballot contract deployed to:", ballotcontract.address);
//get proposals
const getproposals= await ballotcontract.proposals(1);
console.log("get votes from proposal 1 :",getproposals.voteCount);
// console log vote power
console.log("other vote power:",await erc20contract.getPastVotes(other.address,currentblock.number));

//other vote for proposal 1
const ballotcontracttx= await ballotcontract.connect(other).vote(1,ethers.utils.parseEther("1"));   
await ballotcontracttx.wait();
//get proposals
const getvotes = await ballotcontract.proposals(1);
console.log("numbers votes proposal 1 ",getvotes.voteCount);

}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
}) ; // Path: week3\scripts\deploy.ts