import Head from 'next/head'
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { Lottery__factory } from '../typechain-types/factories/contracts/Lottery__factory'
import { LotteryToken__factory } from '../typechain-types/factories/contracts/LotteryToken__factory';

const BET_PRICE = 1;
const BET_FEE = 0.1;
const TOKEN_RATIO = 1000;

export default function Home() {

  const [importkey, setImportkey] = useState("");
  const [init, setInit] = useState("");
  const [status, setStatus] = useState("");
  const [openStatus, setOpenStatus] = useState("");
  const [openStatus2, setOpenStatus2] = useState("");
  const [betHash, setBetHash] = useState("");
  const [duration, setDuration] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [purchase, setPurchase] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [placedBet, setPlacedBet] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [closed, setClosed] = useState("");
  const [winnerPrize, setWinnerPrize] = useState("");
  const [claim, setClaim] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [ownerPool, setOwnerPool] = useState("");
  const [claimOwnerAmount, setClaimOwnerAmount] = useState("");
  const [ownerClaimed, setOwnerClaimed] = useState("");
  const [allowance, setAllowance] = useState("");
  const [burn, setBurn] = useState("");
  const [burnAmount, setBurnAmount] = useState("");

  //Contracts Adham
  // const contractAddress = "0xf4E3f05fB4DC7608a30123d1ce9bB125eCCd4389";
  // const tokenContractAddress = "0xA418544Ff34CDF9fD0C2Bf08ea0a7b292690D743";

  const contractAddress = "0x199a37092f54154eCE72888e7F901593996CFfce";
  const tokenContractAddress = "0x6574BA77D0eed285CFdB781F04d01A77c4311596";
  const alchemyKey = "";

  async function checkState() {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);
    
    const state = await _MyLottry.betsOpen();
    setStatus(`The lottery is ${state ? "open" : "closed"}`);
    if (!state) return;
    const currentBlock = await provider.getBlock("latest");
    const currentBlockDate = new Date(currentBlock.timestamp * 1000);
    const closingTime = await _MyLottry.betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    setOpenStatus(
      `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}`
    );
    setOpenStatus2(
      `The lottery should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}`
    );
  }
  
  async function openBets(duration: string) {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);

    const currentBlock = await provider.getBlock("latest");
    const tx = await _MyLottry.openBets(currentBlock.timestamp + Number(duration));
    const receipt = await tx.wait();
    setBetHash(`Bets opened: ${receipt.transactionHash}`);
  }
  
  async function displayBalance() {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);

    const balanceBN = await provider.getBalance(signer.address);
    const balance = ethers.utils.formatEther(balanceBN);
    setEthBalance(
      `The account of address ${signer.address} has ${balance} ETH`
    );
  }
  
  async function buyTokens(amount: string) {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);

    const tx = await _MyLottry.connect(signer).purchaseTokens({
      value: ethers.utils.parseEther(amount).div(TOKEN_RATIO),
    });
    const receipt = await tx.wait();
    setPurchase(`Tokens bought: ${receipt.transactionHash}`);
  }
  
  async function displayTokenBalance() {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const tokenContractFactory = new LotteryToken__factory(signer);
    const _MyTokn = await tokenContractFactory.attach(tokenContractAddress);

    const balanceBN = await _MyTokn.balanceOf(signer.address);
    const balance = ethers.utils.formatEther(balanceBN);
    setTokenBalance(
      `The account of address ${signer.address} has ${balance} LT0`
    );
  }
  
  async function bet(amount: string) {
    console.log(amount);
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
   const tokenContractFactory = new LotteryToken__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);
   const _MyTokn = await tokenContractFactory.attach(tokenContractAddress);

   const allowTx = await _MyTokn.approve(contractAddress, ethers.constants.MaxUint256);
  const resultado= await allowTx.wait();
   console.log(resultado.transactionHash)
    const tx = await _MyLottry.betMany(amount);
    const receipt = await tx.wait();
    setPlacedBet(`Bets placed: ${receipt.transactionHash}`);
  }
  
  async function closeLottery() {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);

    const tx = await _MyLottry.closeLottery();
    const receipt = await tx.wait();
    setClosed(`Bets closed: ${receipt.transactionHash}`);
  }
  
  async function displayPrize() {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);

    const prizeBN = await _MyLottry.prize(signer.address);
    const prize = ethers.utils.formatEther(prizeBN);
    setWinnerPrize(`The account of address ${signer.address} has earned a prize of ${prize} Tokens`
    );
  }
  
  async function claimPrize(amount: string) {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);

    const tx = await _MyLottry
      .connect(signer)
      .prizeWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    setClaim(`Prize claimed: ${receipt.transactionHash}`);
  }
  
  async function displayOwnerPool() {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);

    const balanceBN = await _MyLottry.ownerPool();
    const balance = ethers.utils.formatEther(balanceBN);
    setOwnerPool(`The owner pool has (${balance}) Tokens`);
  }
  
  async function withdrawTokens(amount: string) {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);

    const tx = await _MyLottry.ownerWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    setOwnerClaimed(`Withdraw confirmed: ${receipt.transactionHash}`);
  }
  
  async function burnTokens(amount: string) {
    const provider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);
    const wallet = new ethers.Wallet(importkey, provider);
    const signer = wallet.connect(provider);
    const contractfactory = new Lottery__factory(signer);
    const tokenContractFactory = new LotteryToken__factory(signer);
    const _MyLottry = await contractfactory.attach(contractAddress);
    const _MyTokn = await tokenContractFactory.attach(tokenContractAddress);

    const allowTx = await _MyTokn
      .connect(signer)
      .approve(_MyLottry.address, ethers.constants.MaxUint256);
    const receiptAllow = await allowTx.wait();
    setAllowance(`Allowance confirmed: ${receiptAllow.transactionHash}`);
    const tx = await _MyLottry
      .connect(signer)
      .returnTokens(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    setBurn(`Burn confirmed: ${receipt.transactionHash}`);
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
            <h2>Import wallet</h2>
            <p> Set your private key </p>
            <input type="text" className="form-control"
              value={importkey}
              onChange={(e) => {
                setImportkey(e.target.value);
                setInit("Wallet Successfully Connected!");
              }}
              placeholder="Paste private key here" />
          </div>
          <p>{init}</p>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Check Lottery Status</h2>
            <button className="btn btn-primary" onClick={() => checkState()}>Check</button>
            <p>{status}</p>
            <p>{openStatus}</p>
            <p>{openStatus2}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Open Lottery</h2>
            <p>Works only if you're the lottery owner</p>
            <input type="text" className="form-control"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
              }}
              placeholder="Duration" />
            <button className="btn btn-primary" onClick={() => openBets(duration)}>Open</button>
            <p>{betHash}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Check ETH Balance</h2>
            <button className="btn btn-primary" onClick={() => displayBalance()}>Check</button>
            <p>{ethBalance}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Buy tokens</h2>
            <input type="text" className="form-control"
              value={buyAmount}
              onChange={(e) => {
                setBuyAmount(e.target.value);
              }}
              placeholder="Amount" />
            <button className="btn btn-primary" onClick={() => buyTokens(buyAmount)}>Buy</button>
            <p>{purchase}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Check Token Balance</h2>
            <button className="btn btn-primary" onClick={() => displayTokenBalance()}>Check</button>
            <p>{tokenBalance}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Place Bet</h2>
            <p>Enter amount to bet</p>
            <input type="text" className="form-control"
              value={betAmount}
              onChange={(e) => {
                setBetAmount(e.target.value);
              }}
              placeholder="Enter Amount" />
            <button className="btn btn-primary" onClick={() => bet(betAmount)}>Bet</button>
            <p>{placedBet}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Close Lottery</h2>
            <p>Works only if you're the lottery owner</p>
            <button className="btn btn-primary" onClick={() => closeLottery()}>Close</button>
            <p>{closed}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Show Prize</h2>
            <button className="btn btn-primary" onClick={() => displayPrize()}>Show</button>
            <p>{winnerPrize}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Claim Prize</h2>
            <p> Enter portion you want to claim </p>
            <p> Will only work if you're the winner </p>
            <input type="text" className="form-control"
              value={claimAmount}
              onChange={(e) => {
                setClaimAmount(e.target.value);
              }}
              placeholder="Amount" />
            <button className="btn btn-primary" onClick={() => claimPrize(claimAmount)}>Claim</button>
            <p>{claim}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Check Owner Pool</h2>
            <button className="btn btn-primary" onClick={() => displayOwnerPool()}>Show</button>
            <p>{ownerPool}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Claim Owner Tokens</h2>
            <p> Enter portion you want to claim </p>
            <p> Will only work if you're the owner</p>
            <input type="text" className="form-control"
              value={claimOwnerAmount}
              onChange={(e) => {
                setClaimOwnerAmount(e.target.value);
              }}
              placeholder="Amount" />
            <button className="btn btn-primary" onClick={() => withdrawTokens(claimOwnerAmount)}>Claim</button>
            <p>{ownerClaimed}</p>
          </div>
        </div>
      </div>

      <div className="album py-5 bg-light">
        <div className="row">
          <div className="col-sm">
            <h2>Burn Tokens</h2>
            <p> Enter amount you want to burn </p>
            <input type="text" className="form-control"
              value={burnAmount}
              onChange={(e) => {
                setBurnAmount(e.target.value);
              }}
              placeholder="Amount" />
            <button className="btn btn-primary" onClick={() => burnTokens(burnAmount)}>Burn</button>
            <p>{allowance}</p>
            <p>{burn}</p>
          </div>
        </div>
      </div>
  
    </div>
  )

}
