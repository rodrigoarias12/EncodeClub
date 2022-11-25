import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Ballot } from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import exp from 'constants';
const PROPOSALS = ["vanilla", "chocolate", "strawberry"];

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
        accounts = await ethers.getSigners();
        // Deploy a new contract before each test
        const ballotfactory = await ethers.getContractFactory('Ballot');
        ballot = await ballotfactory.deploy(
            convertStringArrayToBytes32(PROPOSALS)
        );
        await ballot.deployed();

    });
    it('Has the provided proposal', async () => {
        const proposal = await ballot.proposals(0);
        console.log(ethers.utils.parseBytes32String(proposal.name));
        return expect(PROPOSALS[0]).to.equal(ethers.utils.parseBytes32String(proposal.name)
        );
    });

    it('should return the correct chairperson', async () => {

        const num = await ballot.chairperson();
        return expect(accounts[0].address).to.equal(num);
    });
    describe("when the contract is deployed", function () {
        it("has the provided proposals", async function () {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballot.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
                    PROPOSALS[index]
                );
            }
        });

        it("has zero votes for all proposals", async function () {

            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballot.proposals(index);
                expect(proposal.voteCount).to.eq(0);
            }
        });
        it("sets the deployer address as chairperson", async function () {
            const num = await ballot.chairperson();
            return expect(accounts[0].address).to.equal(num);

        });
        it("sets the voting weight for the chairperson as 1", async function () {
            // TODO
            const num = await ballot.voters(accounts[0].address);
            return expect(num.weight).to.equal(1);
        });
    });

    describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
        it("gives right to vote for another address", async function () {
            await ballot.giveRightToVote(accounts[1].address);
            const num = await ballot.voters(accounts[1].address);
            return expect(num.weight).to.equal(1);
        });
        it("can not give right to vote for someone that has voted", async function () {
            const result = await ballot.giveRightToVote(accounts[1].address);
            await result.wait();
            await ballot.connect(accounts[1]).vote(0);
            await expect(ballot.giveRightToVote(accounts[1].address)).to.be.revertedWith("The voter already voted.");
        });
        it("can not give right to vote for someone that has already voting rights", async function () {
            // TODO
            await ballot.giveRightToVote(accounts[1].address);
            await expect(ballot.giveRightToVote(accounts[1].address)).to.be.revertedWith("The voter already has voting rights.");
        });
    });

    describe("when the voter interact with the vote function in the contract", function () {
        // TODO
        it("should register the vote", async () => {
            await ballot.giveRightToVote(accounts[1].address);
            await ballot.connect(accounts[1]).vote(0);
            const proposal = await ballot.proposals(0);
            expect(proposal.voteCount).to.eq(1);
        });
    });

    describe("when the voter interact with the delegate function in the contract", function () {
        // TODO
        it("should transfer voting power", async () => {
            await ballot.giveRightToVote(accounts[1].address);
            await ballot.giveRightToVote(accounts[2].address);
            await ballot.connect(accounts[1]).delegate(accounts[2].address);
            await ballot.connect(accounts[2]).vote(0);
            const proposal = await ballot.proposals(0);
            expect(proposal.voteCount).to.eq(2);
            await ballot.giveRightToVote(accounts[3].address);
            await ballot.connect(accounts[3]).delegate(accounts[2].address);
            const delegateAfterHaveVotedResult = await ballot.proposals(0);
            expect(delegateAfterHaveVotedResult.voteCount).to.eq(3);

        });
    });

    describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
        // TODO
        it("should revert", async () => {
            await expect(ballot.connect(accounts[2]).giveRightToVote(accounts[1].address))
                .to.be.revertedWith("Only chairperson can give right to vote.");
        });

    });

    describe("when the an attacker interact with the vote function in the contract", function () {
        // TODO
        it("should revert", async () => {
            await expect(ballot.connect(accounts[2]).vote(accounts[1].address))
                .to.be.revertedWith("Has no right to vote");
        });
    });

    describe("when the an attacker interact with the delegate function in the contract", function () {
        // TODO
        it("should revert", async () => {
            await expect(ballot.connect(accounts[2]).delegate(accounts[1].address))
                .to.be.revertedWith("You have no right to vote");
        });
    });

    describe("when someone interact with the winningProposal function before any votes are cast", function () {
        // TODO
        it("should return 0", async () => {
          const winningProposal = await ballot.winningProposal();
          expect(winningProposal).to.equal(0);
        });
    });

    describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
        // TODO
        it("should return 0", async () => {
            await ballot.giveRightToVote(accounts[1].address);
            await ballot.connect(accounts[1]).vote(0);
            const winningProposal = await ballot.winningProposal();
            expect(winningProposal).to.equal(0);
        });
    });

    describe("when someone interact with the winnerName function before any votes are cast", function () {
        // TODO
        it("should return name of proposal 0", async () => {
            const winnerName = await ballot.winnerName();
            expect(ethers.utils.parseBytes32String(winnerName)).to.equal( PROPOSALS[0]);
        });
    });

    describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
        // TODO
        it("should return name of proposal 0", async () => {
           await ballot.giveRightToVote(accounts[1].address);
        await ballot.connect(accounts[1]).vote(0);
        const winnerName = await ballot.winnerName();
        expect(ethers.utils.parseBytes32String(winnerName)).to.equal( PROPOSALS[0]);
        });
    });

    describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
        // TODO
        it("should return the name of the winner proposal", async () => {
           await ballot.giveRightToVote(accounts[1].address);
        await ballot.giveRightToVote(accounts[2].address);
        await ballot.giveRightToVote(accounts[3].address);
        await ballot.giveRightToVote(accounts[4].address);
        await ballot.giveRightToVote(accounts[5].address);
        await ballot.connect(accounts[1]).vote(1);
        await ballot.connect(accounts[2]).vote(1);
        await ballot.connect(accounts[3]).vote(2);
        await ballot.connect(accounts[4]).vote(2);
        await ballot.connect(accounts[5]).vote(1);
        const winnerName = await ballot.winnerName();
        expect(ethers.utils.parseBytes32String(winnerName)).to.equal( PROPOSALS[1]);

        });
    });


});