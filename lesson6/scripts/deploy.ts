import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types';
import { Ballot__factory } from '../typechain-types/factories';
import { SignerWithAddress     } from '@nomiclabs/hardhat-ethers/signers';
const PROPOSALS  = ["vanilla", "chocolate", "strawberry"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}
async function main() {
    let ballot: Ballot;
    let accounts: SignerWithAddress[];
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // TODO
  console.log("Ballot contract deployed" ,convertStringArrayToBytes32(PROPOSALS ).toString());
//  const provider = ethers.getDefaultProvider("goerli");
//  const lastBlock = await provider.getBlock("latest");
//  console.log({ lastBlock });
//ultimo
// const provider = ethers.getDefaultProvider("goerli");
// const wallet =      new ethers.Wallet("fsadfasfasd", provider);
//   const signer = wallet.connect(provider);
//    const balanceBN = await signer.getBalance();
//    console.log(`Connected to the account of address ${signer.address}`);
//    console.log(`The balance of this account is ${balanceBN.toString()} Wei`);
//ultimo

//   accounts= await ethers.getSigners();
//         // Deploy a new contract before each test
//      //   const ballotfactory = await ethers.getContractFactory('Ballot');
//         const ballotFactory = new Ballot__factory(accounts[0]);


//         ballot = await ballotFactory.deploy(
//             convertStringArrayToBytes32(PROPOSALS )
//           );
//         await ballot.deployed();
//     console.log("Ballot contract deployed", ballot.deployTransaction.hash);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});