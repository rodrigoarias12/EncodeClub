import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {Mytoken} from '../typechain-types/contracts';
import {Mytoken__factory} from '../typechain-types/factories/contracts';

require('dotenv').config();

async function main(){
const accounts=await ethers.getSigners();
const erc20contractfactory = new Mytoken__factory(accounts[0]);
const erc20contract = await erc20contractfactory.deploy();
await erc20contract.deployed();
console.log("ERC20 contract deployed to:", erc20contract.address);
const mintTx = await erc20contract.mint(accounts[0].address, 2000);
await mintTx.wait();

const totalSupply = await erc20contract.totalSupply();
console.log("Total supply:", totalSupply.toString());
const balance = await erc20contract.balanceOf(accounts[0].address);
console.log("Balance of account[0]:", balance.toString());
const tx = await erc20contract.transfer(accounts[1].address, 100);
await tx.wait();
const balance1 = await erc20contract.balanceOf(accounts[1].address);
console.log("Balance of account[1]:", balance1.toString());


}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
}) ; // Path: lesson9\scripts\deploy.ts