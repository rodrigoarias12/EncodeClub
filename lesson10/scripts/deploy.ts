import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {TokenSale} from '../typechain-types/contracts/MyTokenSale.sol';
import {TokenSale__factory} from '../typechain-types/factories/contracts/MyTokenSale.sol/';

require('dotenv').config();
const TOKEN_ETH_RATIO = 1;
async function main(){
    
const accounts=await ethers.getSigners();
const erc20contractfactory = new TokenSale__factory(accounts[0]);
const erc20contract = await erc20contractfactory.deploy(TOKEN_ETH_RATIO);
await erc20contract.deployed();
console.log("ERC20 contract deployed to:", erc20contract.address);


}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
}) ; // Path: lesson9\scripts\deploy.ts