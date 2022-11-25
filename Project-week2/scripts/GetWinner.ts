import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types/Ballot';
import { Ballot__factory } from '../typechain-types/factories/Ballot__factory';
import * as dotenv from 'dotenv';
dotenv.config();


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

    //get the winner
    const winner = await ballotContract.winningProposal();
    console.log("The winner is: ", winner.toString());
    //get proposal name
    const proposalName = await ballotContract.proposals(winner);
    console.log("The winner is: ", ethers.utils.parseBytes32String(proposalName.name));
    //get proposals
    const proposals = await ballotContract.proposals(winner);
    console.log("The winner have : ", proposals.voteCount.toString(), " votes");
        
}


main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})