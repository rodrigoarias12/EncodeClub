import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types/Ballot';
import { Ballot__factory } from '../typechain-types/factories/Ballot__factory';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of address ${signer.address}`);
    console.log(`The blance of this account is ${balanceBN.toString()} Wei`);


    let ballotContract: Ballot;
    const ballotFactory = new Ballot__factory(signer);
    ballotContract = ballotFactory.attach(process.env.CONTRACT_ADDRESS ?? "");
    const tx = await ballotContract.delegate("0xFecb77b4C504d3b614402735E643199CeADd22D7");
    const receipt = await tx.wait();
    console.log({receipt});
}


main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})