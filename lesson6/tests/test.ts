import { expect } from 'chai';
import {ethers} from 'hardhat';
import { HelloWorld  } from '../typechain-types/HelloWord.sol';

describe('hello word', () => {
    it('should return Hello Word from contract', async() => {
        const hellowordfactory = await ethers.getContractFactory('HelloWorld');
        const helloword = await hellowordfactory.deploy();
        await helloword.deployed();
const text = await helloword.helloWorld();
        return expect(text).to.equal('Hello World');
    });
    it('should be owner first addess ', async() => {
        const hellowordfactory = await ethers.getContractFactory('HelloWorld');
        const helloword = await hellowordfactory.deploy();
        await helloword.deployed();
const owner = await helloword.owner();
        return expect(owner).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    });            
    it("Should execute transferOwnership correctly", async function () {
        const hellowordfactory = await ethers.getContractFactory('HelloWorld');
        const helloword = await hellowordfactory.deploy();
        await helloword.deployed();
        const accounts = await ethers.getSigners();
        const tx = await helloword.transferOwnership(accounts[2].address);
        await tx.wait();
        const owner = await helloword.owner();
        return expect(owner).to.equal(accounts[2].address);        
      });
    
      it("Should not allow anyone other than owner to change text", async function () {
        const hellowordfactory = await ethers.getContractFactory('HelloWorld');
        const helloword = await hellowordfactory.deploy();
        await helloword.deployed();
        const accounts = await ethers.getSigners();
        await expect(
            helloword
              .connect(accounts[1])
              .setText("address")
          ).to.be.revertedWith("Caller is not the owner");
      });
    
      it("Should change text correctly", async function () {
        const hellowordfactory = await ethers.getContractFactory('HelloWorld');
        const helloword = await hellowordfactory.deploy();
        await helloword.deployed();
        const accounts = await ethers.getSigners();
        const tx = await helloword.setText("address");
        await tx.wait();
        const text = await helloword.helloWorld();
        return expect(text).to.equal("address");
      });

});
