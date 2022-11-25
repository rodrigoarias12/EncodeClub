// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { abi } from '../../../contracts/abi/MyToken.json'
import { MyToken } from '../../../typechain-types/contracts/ERC20Votes.sol'
import { MyToken__factory } from '../../../typechain-types/factories/contracts/ERC20Votes.sol/'
type Data = {
    balance: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let _MyToken: MyToken;
    //conect to the blockchain
    const provider = await ethers.providers.getDefaultProvider('goerli');
    const contractAddress = process.env.CONTRACT_ADDRESS ;
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const signer = wallet.connect(provider);
    const erc20contractfactory = new MyToken__factory(signer);
    _MyToken = await erc20contractfactory.attach(contractAddress as string);
    const balance = (await _MyToken.balanceOf(process.env.ADDRESS2!)).toString();;   

    res.status(200).json({ balance : balance })
    //request tokens() mint from the contract

    //conect ballot()  contract ballot 
    // todo fech informatio og that ballot to be displayed in the page

}
