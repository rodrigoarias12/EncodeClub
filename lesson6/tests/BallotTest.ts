import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types';
import { SignerWithAddress     } from '@nomiclabs/hardhat-ethers/signers';
const PROPOSALS  = ["vanilla", "chocolate", "strawberry"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

describe('Ballot', async () => {
    let ballot: Ballot;
    let accounts: SignerWithAddress[];
    beforeEach(async () => {
        accounts= await ethers.getSigners();
        // Deploy a new contract before each test
        const ballotfactory = await ethers.getContractFactory('Ballot');
        ballot = await ballotfactory.deploy(
            convertStringArrayToBytes32(PROPOSALS )
          );
        await ballot.deployed();

    });
    it('Has the provided proposal' , async () => {
        const proposal = await ballot.proposals(0);
        console.log(ethers.utils.parseBytes32String(proposal.name));
        return expect(PROPOSALS[0]).to.equal(ethers.utils.formatBytes32String(proposal.name)
        );
    });
    
    it('should return the correct chairperson', async () => {
        
        const num = await ballot.chairperson();
        return expect(accounts[0].address).to.equal(num);
    });

});