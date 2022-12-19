import { BigNumber } from 'ethers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
//escrow    
import { Escrow } from '../typechain-types/contracts/Escrow';

describe('Escrow', async () => {
    let accounts: SignerWithAddress[];
    let escrow: Escrow;
    beforeEach(async function () {
        accounts = await ethers.getSigners();
        const EscrowFactory = await ethers.getContractFactory('Escrow');
        escrow = await EscrowFactory.deploy();
        await escrow.deployed();
        console.log('Escrow deployed to:', escrow.address);
    });
    // it('should publish auction with tittle description and minAmount', async () => {
    //     const result = await escrow.PublishAuction('test', 'test', ethers.utils.parseEther('100'));
    //     await  result.wait();
    //     const auction = await escrow.auctions(0);
    //     expect(auction.tittle).to.equal('test');
    //     expect(auction.description).to.equal('test');
    //     // expect(auction.minAmount).to.equal(ethers.utils.parseEther('100'));
    // });
    it("should publish an ofert in escrow", async () => {
        accounts = await ethers.getSigners();
        const result = await escrow.connect(accounts[0]).PublishAuction('test', 'test', ethers.utils.parseEther('10'));
       const tx= await  result.wait();
        console.log( tx.transactionHash );
        const result1 = await escrow.connect(accounts[1]).Bid(0, {value: ethers.utils.parseEther('11')});
       
        // const auctions = await escrow.auctions(0);
        // expect(auctions.minAmount).to.equal(ethers.utils.parseEther('11'));
        // expect(auctions.highestBidder).to.equal(accounts[1].address);
    });

});  
