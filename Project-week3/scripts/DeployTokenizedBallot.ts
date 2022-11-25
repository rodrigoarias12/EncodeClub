import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
//import token contract
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol';
import { MyToken__factory } from '../typechain-types/factories/contracts/ERC20Votes.sol';
//import ballot contract
import { Ballot } from '../typechain-types/contracts/TokenizedBallot.sol';
import { Ballot__factory } from '../typechain-types/factories/contracts/TokenizedBallot.sol';
require('dotenv').config();

const PROPOSALS = ["vanilla", "chocolate", "strawberry"];
function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}
async function main() {

    const provider = await ethers.providers.getDefaultProvider("goerli");
    //last block
    const blockNumber = await provider.getBlock("latest");
    //deploy ballot contract
    const accounts = await ethers.getSigners();
    const ballotcontractfactory = new Ballot__factory(accounts[0]);
    const ballotcontract = await ballotcontractfactory.deploy(convertStringArrayToBytes32(PROPOSALS),process.env.CONTRACT_ADDRESS! ,blockNumber.number);
    await ballotcontract.deployed();
    console.log("Ballot contract deployed to:", ballotcontract.address);




}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });