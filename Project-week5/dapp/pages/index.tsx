import Head from 'next/head'
import { BigNumber, ethers } from "ethers";
import { useAccount, useClient } from "wagmi";
import { useEffect, useState } from "react";
import Router from 'next/router';
import { Lottery } from '../typechain-types/contracts/Lottery'
import { Lottery__factory } from '../typechain-types/factories/contracts/Lottery__factory'
const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;
export default function Home() {
  let _MyLottry: Lottery;
  const [address, setAddress] = useState("");
  const { isConnected } = useAccount();  
  const [amount, setAmount] = useState("");
const [hash, setHash] = useState("");

  //delegate votes
  async function buyTokens() {
    const provider = new ethers.providers.AlchemyProvider("goerli","yourkey");

   // const provider = ethers.getDefaultProvider("goerli");
    const contractAddress = "0x199a37092f54154eCE72888e7F901593996CFfce";

    console.log("contractAddress", contractAddress);
//borrar
    const wallet = new ethers.Wallet("walletkey", provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    _MyLottry = await contractfactory.attach(contractAddress);

    const tx = await _MyLottry.purchaseTokens({
      value: ethers.utils.parseEther(amount).div(TOKEN_RATIO),
    });
    const receipt = await tx.wait();
    console.log(`Tokens bought (${receipt.transactionHash})\n`);
    setHash(receipt.transactionHash);
    }

  return (

    <div className="container-fluid">
      <Head>
        <title>Lottery</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Lottery Contract</h1>
        
        </div>
      </section>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Buy tokens</h2>
            <p> Buy tokens </p>
            <input type="text" className="form-control"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="Amount" />
            <button className="btn btn-primary" onClick={() => buyTokens()}>Buy</button>

          </div>    

        </div>
      </div>
    </div>
  )

}
