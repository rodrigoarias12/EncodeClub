import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types/Ballot';
import { Ballot__factory } from '../typechain-types/factories/Ballot__factory';
import * as dotenv from 'dotenv';
dotenv.config();

const PROPOSALS = ["Vanilla", "Lime", "Chocolate"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const seed = process.env.MNEMONIC;
    const wallet = ethers.Wallet.fromMnemonic(seed ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of address ${signer.address}`);
    console.log(`The blance of this account is ${balanceBN.toString()} Wei`);

    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    const targetAccount = params[1];
    let ballotContract: Ballot;
    const ballotFactory = new Ballot__factory(signer);
    ballotContract = ballotFactory.attach(contractAddress);
    const tx = await ballotContract.giveRightToVote(targetAccount);
    const receipt = await tx.wait();
    console.log({receipt});
}


main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})