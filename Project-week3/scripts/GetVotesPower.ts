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

    let ballotcontract: Ballot;

    //deploy ballot contract
    const accounts = await ethers.getSigners();
    const ballotcontractfactory = new Ballot__factory(accounts[0]);
    ballotcontract = ballotcontractfactory.attach(process.env.CONTRACT_ADDRESS_BALLOT!);
  
    //get vote power of account[0]
    const votePower = await ballotcontract.votePower(accounts[0].address);
    console.log("Vote power of account[0] is:", votePower.toString());

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