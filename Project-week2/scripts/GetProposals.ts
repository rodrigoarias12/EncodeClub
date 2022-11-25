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
    console.log(`The balance of this account is ${balanceBN.toString()} Wei`);

    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    let ballotContract: Ballot;
    const ballotFactory = new Ballot__factory(signer);
    ballotContract = ballotFactory.attach(contractAddress);
    const proposal1 = await ballotContract.proposals(0);
    const proposal2 = await ballotContract.proposals(1);
    const proposal3 = await ballotContract.proposals(2);
    console.log('Proposal 1'+ethers.utils.parseBytes32String(proposal1.name));
    console.log('Proposal 2'+ethers.utils.parseBytes32String(proposal2.name));
    console.log('Proposal 3'+ethers.utils.parseBytes32String(proposal3.name));    
}


main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})