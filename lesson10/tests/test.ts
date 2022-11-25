import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
//token sale    
import { TokenSale } from '../typechain-types/contracts/MyTokenSale.sol';
import { TokenSale__factory } from '../typechain-types/factories/contracts/MyTokenSale.sol/';
//token erc20
import { MyToken } from '../typechain-types/contracts/MyERC20.sol';
import { MyToken__factory } from '../typechain-types/factories/contracts/MyERC20.sol';
//token erc721
import { Mytoken721 } from '../typechain-types/contracts/MyERC721.sol';
import { MyToken721__factory } from '../typechain-types/factories/contracts/MyERC721.sol';

import { validateHeaderValue } from 'http';
require('dotenv').config();

const TOKEN_ETH_RATIO = 1;
describe("TokenSale contract", function () {
    let accounts: SignerWithAddress[];
    let tokensalecontract: TokenSale;
    let paymentTokenContract: MyToken;
    let token721Contract: Mytoken721;
    before(async function () {

        accounts = await ethers.getSigners();
        const erc20tokenContractFactory = new MyToken__factory(accounts[0]);
        paymentTokenContract = await erc20tokenContractFactory.deploy();
        await paymentTokenContract.deployed();
        console.log("ERC20 contract deployed to:", paymentTokenContract.address);


        const tokensalecontractfactory = new TokenSale__factory(accounts[0]);
        tokensalecontract = await tokensalecontractfactory.deploy(TOKEN_ETH_RATIO, paymentTokenContract.address);
        await tokensalecontract.deployed();
        console.log("tokensalecontract contract deployed to:", tokensalecontract.address);

        await paymentTokenContract.grantRole(await paymentTokenContract.MINTER_ROLE(), tokensalecontract.address);
        await tokensalecontract.purchaseTokens({ value: BigNumber.from(1000) });
    });
    it("should have the correct token/eth ratio", async function () {
        const ratio = await tokensalecontract.ratio();
        expect(ratio).to.equal(TOKEN_ETH_RATIO);
    }
    );
    it("uses a valid erc20 token as payment", async function () {
        const paymentTokenContractAddress = await tokensalecontract.paymentToken();
        const erc20tokenContractFactory = new MyToken__factory(accounts[0]);
        const erc20tokenContract = await erc20tokenContractFactory.attach(paymentTokenContractAddress);
        const name = await erc20tokenContract.name();
        expect(name).to.eq("mytoken");
        const balance = await erc20tokenContract.balanceOf(accounts[0].address);
        expect(balance).to.eq(1000);
    }
    );

    describe("When a user purchase an ERC20 from the Token contract", async () => {
      const ETH_SENT = ethers.utils.parseEther("1");    
      let balancebefore : BigNumber;
      let gasCost:BigNumber;
        beforeEach(async () => { 
        balancebefore = await accounts[1].getBalance();
   const  tx =  await tokensalecontract.connect(accounts[1]).purchaseTokens({ value: ETH_SENT });
   const receipt = await tx.wait();
const gasUsed = receipt.gasUsed;
const gasPrice = receipt.effectiveGasPrice;
 gasCost = gasUsed.mul(gasPrice);
 
        });

        it("charges the correct amount of ETH", async () => {
            const balaceafeter = await accounts[1].getBalance();
            const expectedBalance = balancebefore.sub(ETH_SENT).sub(gasCost);
                expect(balaceafeter).to.eq(expectedBalance);
                const error =expectedBalance.sub(balaceafeter);
                expect(error).to.eq(0);
        });

        it("gives the correct amount of tokens", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("When a user burns an ERC20 at the Token contract", async () => {
        it("gives the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        });

        it("burns the correct amount of tokens", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("When a user purchase a NFT from the Shop contract", async () => {
        it("charges the correct amount of ETH", async () => {
            throw new Error("Not implemented");
        });

        it("updates the owner account correctly", async () => {
            throw new Error("Not implemented");
        });

        it("update the pool account correctly", async () => {
            throw new Error("Not implemented");
        });

        it("favors the pool with the rounding", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("When a user burns their NFT at the Shop contract", async () => {
        it("gives the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });
        it("updates the pool correctly", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("When the owner withdraw from the Shop contract", async () => {
        it("recovers the right amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });

        it("updates the owner account correctly", async () => {
            throw new Error("Not implemented");
        });
    });
});
// Path: lesson10\scripts\deploy.ts


