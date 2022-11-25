import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
//token erc20
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol';

require('dotenv').config();

describe("TokenSale contract", function () {
    let accounts: SignerWithAddress[];
   
    before(async function () {

        accounts = await ethers.getSigners();
        
    });
  
    it("should have the correct token/eth ratio", async function () {

    });
    
});
// Path: lesson10\scripts\deploy.ts


