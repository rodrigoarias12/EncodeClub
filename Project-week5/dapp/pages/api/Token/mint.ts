// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { MyToken } from '../../../typechain-types/contracts/ERC20Votes.sol'
import { MyToken__factory } from '../../../typechain-types/factories/contracts/ERC20Votes.sol/'

//receives the address of the user and the amount of tokens to mint
type Data = {
   address: string,
    amount: string
}
//create post request to mint tokens
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const{address, amount} = req.body;
    console.log(address, amount);
    let _MyToken: MyToken;
    //conect to goerli blockchain
    const provider = await ethers.providers.getDefaultProvider('goerli');
    const contractAddress = process.env.CONTRACT_ADDRESS_TOKEN ;
    console.log(contractAddress);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY1!, provider);
    const signer = wallet.connect(provider);
    const erc20contractfactory = new MyToken__factory(signer);
    _MyToken = await erc20contractfactory.attach(contractAddress as string);

    //request tokens() mint from the contract
    const tx = await _MyToken.mint(address, ethers.utils.parseEther(amount));
    await tx.wait();
    console.log("Minted tokens to address: ", address);
    res.status(200).json({ message: "Tokens minted" })
}

    
