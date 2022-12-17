import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
//token erc20
//import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol';

require('dotenv').config();

describe("Escrow contract", function () {
    let accounts: SignerWithAddress[];
   
    before(async function () {

        accounts = await ethers.getSigners();
        
    });
  
    it("should create a action with description and minimal amount", async function () {
        const Escrow = await ethers.getContractFactory("Escrow");
        const escrow = await Escrow.deploy();
        await escrow.deployed();
        const action = await escrow.createAction("Buy a car", 100);
        const actionId = await action.wait();
        const actionIdNumber = actionId.events[0].args[0].toNumber();
        const actionInfo = await escrow.actions(actionIdNumber);
        expect(actionInfo.description).to.equal("Buy a car");
        expect(actionInfo.minAmount).to.equal(100);
    });
    it("should publish an ofert in escrow", async function () {
        const Escrow = await ethers.getContractFactory("Escrow");
        const escrow = await Escrow.deploy();
        await escrow.deployed();
        const action = await escrow.createAction("Buy a car", 100);
        const actionId = await action.wait();
        const actionIdNumber = actionId.events[0].args[0].toNumber();
        const ofert = await escrow.publishOfert(actionIdNumber, 100);
        const ofertId = await ofert.wait();
        const ofertIdNumber = ofertId.events[0].args[0].toNumber();
        const ofertInfo = await escrow.oferts(ofertIdNumber);
        expect(ofertInfo.amount).to.equal(100);
    });
    it("Ofert Should be reverted amount should be more than minAmount  ", async function () {
        const Escrow = await ethers.getContractFactory("Escrow");
        const escrow = await Escrow.deploy();
        await escrow.deployed();
        const action = await escrow.createAction("Buy a car", 100);
        const actionId = await action.wait();
        const actionIdNumber = actionId.events[0].args[0].toNumber();
        await expect(escrow.publishOfert(actionIdNumber, 50)).to.be.revertedWith("Amount should be more than minAmount");
       
    });
    
});
// Path: Final-Project\contracts\Escrow.sol


