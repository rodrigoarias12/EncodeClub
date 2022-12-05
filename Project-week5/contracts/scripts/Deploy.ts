import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Lottery, LotteryToken } from "../../../lesson20/typechain-types";

let contract: Lottery;
let token: LotteryToken;
let accounts: SignerWithAddress[];

const BET_PRICE = 1;
const BET_FEE = 0.1;
const TOKEN_RATIO = 1000;
async function main() {
const contractFactory = await ethers.getContractFactory("Lottery");
contract = await contractFactory.deploy(
  "LotteryToken",
  "LT0",
  TOKEN_RATIO,
  ethers.utils.parseEther(BET_PRICE.toFixed(18)),
  ethers.utils.parseEther(BET_FEE.toFixed(18))
);
await contract.deployed();
console.log(contract.address);
const tokenAddress = await contract.paymentToken();
console.log(tokenAddress);
// const tokenAddress = await contract.paymentToken();

// const tokenFactory = await ethers.getContractFactory("LotteryToken");
// token = tokenFactory.attach(tokenAddress);
}
main()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});