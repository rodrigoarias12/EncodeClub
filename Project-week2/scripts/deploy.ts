import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types';
import { Ballot__factory } from '../typechain-types/factories';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
require('dotenv').config()

const PROPOSALS = ["vanilla", "chocolate", "strawberry"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}
async function main() {
  let ballot: Ballot;
  let accounts: SignerWithAddress[];
  console.log("Deploying Ballot contract");


  //connect with the provider
  const provider = ethers.getDefaultProvider("goerli");
  console.log(process.env.PRIVATE_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  console.log(`Connected to the account of address ${signer.address}`);
  console.log(`The balance of this account is ${balanceBN.toString()} Wei`);
  //connect with the provider

  //Get the accounts
  accounts = await ethers.getSigners();
  // Deploy a new contract
  const ballotFactory = await ethers.getContractFactory('Ballot');
  // const ballotFactory = new Ballot__factory(accounts[0]);
  ballot = await ballotFactory.connect(signer).deploy(
    convertStringArrayToBytes32(PROPOSALS)
  );
  await ballot.deployed();
  console.log("Ballot contract deployed", ballot.deployTransaction.hash);
  //get address of the contract
  console.log("Ballot contract address", ballot.address);
  //give voting rights
  await ballot.giveRightToVote("0xFecb77b4C504d3b614402735E643199CeADd22D7");
  await ballot.giveRightToVote("0x1b5839Ae69b208457Da741D70C29D430991280Fd");
  await ballot.giveRightToVote("0xE0C760C5d1672C6d3adb07D94d1D2C82c95BBAd3");
  // await ballot.giveRightToVote(accounts[4].address);
  // await ballot.giveRightToVote(accounts[5].address);

  //casting votes
//   await ballot.connect(accounts[1]).vote(0);
//   await ballot.connect(accounts[2]).vote(1);
//   await ballot.connect(accounts[3]).vote(2);
//   await ballot.connect(accounts[4]).vote(0);
//   //delegate votes
//   await ballot.connect(accounts[5]).delegate(accounts[1].address);
//   //casting votes
//   // await ballot.connect(accounts[1]).vote(0);

//   //get the winner
//   const winner = await ballot.winningProposal();
//   console.log("The winner is: ", winner.toString());
//   //get proposal name
//   const proposalName = await ballot.proposals(winner);
//   console.log("The winner is: ", ethers.utils.parseBytes32String(proposalName.name));
//   //get proposals
//   const proposals = await ballot.proposals(winner);
//   console.log("The winner have : ", proposals.voteCount.toString(), " votes");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});