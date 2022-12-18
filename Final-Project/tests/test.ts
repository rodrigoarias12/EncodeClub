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
    });
    it('should publish auction with tittle description and minAmount', async () => {
        await escrow.PublishAuction('test', 'test', ethers.utils.parseEther('100'));
        const auction = await escrow.auctions(0);
        expect(auction.tittle).to.equal('test');
        expect(auction.description).to.equal('test');
        expect(auction.minAmount).to.equal(ethers.utils.parseEther('100'));
    });
    it("should publish an ofert in escrow", async function () {
        const publish = await escrow.PublishAuction('test', 'test',ethers.utils.parseEther('10'));
        publish.wait();
        await escrow.connect(accounts[1].address).Bid(0, {value: ethers.utils.parseEther('11')});
        const ofert = await escrow.auctions(0);
        expect(ofert.minAmount).to.equal(ethers.utils.parseEther('11'));
        expect(ofert.highestBidder ).to.equal(accounts[1].address);
    });

});  
