import { BigNumber } from 'ethers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
//escrow    
import { Escrow } from '../typechain-types/Escrow';
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe('Escrow', async () => {
    let accounts: SignerWithAddress[];
    let escrow: Escrow;
    const FEE = 0.01;
    beforeEach(async function () {
        accounts = await ethers.getSigners();
        const EscrowFactory = await ethers.getContractFactory('Escrow');
        escrow = await EscrowFactory.deploy(ethers.utils.parseEther(FEE.toFixed(18)));
        await escrow.deployed();
        console.log('Escrow deployed to:', escrow.address);
    });
    it('should publish auction with tittle description and minAmount', async () => {
        const result = await escrow.PublishAuction('test', 'test', ethers.utils.parseEther('100'));
        await result.wait();
        const auction = await escrow.auctions(0);
        expect(auction.tittle).to.equal('test');
        expect(auction.description).to.equal('test');
        expect(auction.minAmount).to.equal(ethers.utils.parseEther('100'));
    });
    it("should publish an ofert in escrow", async () => {
        accounts = await ethers.getSigners();
        const result = await escrow.connect(accounts[0]).PublishAuction('test', 'test', ethers.utils.parseEther('10'));
        const tx = await result.wait();
        const result1 = await escrow.connect(accounts[1]).Bid(0, { value: ethers.utils.parseEther('11') });
        const auctions = await escrow.auctions(0);
        expect(auctions.minAmount).to.equal(ethers.utils.parseEther('11'));
        expect(auctions.highestBidder).to.equal(accounts[1].address);
    });
    it("should not publish an ofert in escrow", async () => {
        const result = await escrow.PublishAuction('test', 'test', ethers.utils.parseEther('10'));
        await result.wait();
        await expect(escrow.connect(accounts[1]).Bid(0, { value: ethers.utils.parseEther('9') })).to.be.revertedWith("The amount is not enough");
    });
    it("should  win with bid auction and then use the scrow ", async () => {
        const result = await escrow.PublishAuction('test', 'test', ethers.utils.parseEther('10'));
        await result.wait();
        //bid auction
        const result1 = await escrow.connect(accounts[1]).Bid(0, { value: ethers.utils.parseEther('11') });
        const auctions = await escrow.auctions(0);
        expect(auctions.minAmount).to.equal(ethers.utils.parseEther('11'));
        expect(auctions.highestBidder).to.equal(accounts[1].address);
        //bid auction
        const result2 = await escrow.connect(accounts[2]).Bid(0, { value: ethers.utils.parseEther('12') });
        const auctions2 = await escrow.auctions(0);
        expect(auctions2.minAmount).to.equal(ethers.utils.parseEther('12'));
        expect(auctions2.highestBidder).to.equal(accounts[2].address);
        //increase time
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const unlockTime = (await time.latest()) + (ONE_YEAR_IN_SECS + 1);
        await time.increaseTo(unlockTime);
        //close auction
        const result3 = await escrow.Close(0);
        //use escrow owner Approved
        const result4 = await escrow.connect(accounts[0]).Approve(0);
        const tx2 = result4.wait();
        //use escrow buyerApproved
        const result5 = await escrow.connect(accounts[2]).Approve(0);
        const tx = await result5.wait();
   
        console.log("contractBalance ", await ethers.provider.getBalance(escrow.address));
        console.log("account 2 Balance ", await ethers.provider.getBalance(accounts[2].address));
        console.log("account 1 Balance ", await ethers.provider.getBalance(accounts[1].address));
        console.log("account 0 Balance ", await ethers.provider.getBalance(accounts[0].address));
    }
    );


});  
