import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Escrow } from "../typechain-types";

let contract: Escrow;
let accounts: SignerWithAddress[];

const FEE = 0.01;
async function main() {
const contractFactory = await ethers.getContractFactory("Escrow");
contract = await contractFactory.deploy(  ethers.utils.parseEther(FEE.toFixed(18)));
await contract.deployed();
console.log(contract.address);
}
main()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});