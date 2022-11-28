import Head from 'next/head'
import { BigNumber, ethers } from "ethers";
import { useAccount, useClient } from "wagmi";
import { useEffect, useState } from "react";
import Router from 'next/router';
import { MyToken } from '../typechain-types/contracts/ERC20Votes.sol'
import { MyToken__factory } from '../typechain-types/factories/contracts/ERC20Votes.sol/'
//import ballot contract
import { Ballot } from '../typechain-types/contracts/TokenizedBallot.sol';
import { Ballot__factory } from '../typechain-types/factories/contracts/TokenizedBallot.sol';
export default function Home() {
  let _MyToken: MyToken;
  let _Ballot: Ballot;
  // use state to store the value of the input
 
  const [address, setAddress] = useState("");
  const [randomPrivateKey, setRandomPrivateKey] = useState("");
  const { isConnected } = useAccount();
  const [ballot, setBallot] = useState("");
  //votes state
  const [votes, setVotes] = useState("");
 //options state
  const [options, setOptions] = useState("");
  //amount
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [votePower, setVotePower] = useState("");
  const [winnerName, setWinnerName] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [status, setStatus] = useState("");
  const [hash, setHash] = useState("");


  async function createwallet() {
    console.log("createwallet");
    //create a provider
    //create address random
 
    const provider = ethers.getDefaultProvider("goerli");
    const  random = await ethers.Wallet.createRandom();
    console.log(random);
    setAddress(random.address);
    const  randomAddress = random.address;
    setRandomPrivateKey(random.privateKey);
    const  randomMnemonic = random.mnemonic;
    const randomSigner = await random.connect(provider);
    const ethBalance = await randomSigner.getBalance();
    setEthBalance(ethBalance.toString());
    document.getElementById("request")?.removeAttribute("hidden");
    document.getElementById("delegate")?.removeAttribute("hidden");
    document.getElementById("balance")?.removeAttribute("hidden");
    document.getElementById("power")?.removeAttribute("hidden");
    document.getElementById("vote")?.removeAttribute("hidden");
  }

  async function requestTokens() {
    //todo: request tokens to be minted in the backend
    console.log("requestTokens");
    //event.preventDefault();

    try {
      const body = {
        address: address,
        amount: "10",

      };
      await fetch('/api/Token/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      // await Router.push('/admin/binance/');
      setStatus("Done! Check your balance.");
    } catch (error) {
      console.error(error);
    }
    //after the transaction you can call getBalance
  }

  //delegate votes
  async function autoDelegate() {
    const provider = ethers.getDefaultProvider("goerli");
    const contractAddress = "0x39311Fb4Fc198A6d481Dd7CcA9482EcBD1018F51";

    console.log("contractAddress", contractAddress);
    console.log("randomPrivateKey", randomPrivateKey);

    const wallet = new ethers.Wallet(randomPrivateKey, provider);
    const signer = wallet.connect(provider);
    const erc20contractfactory = new MyToken__factory(signer);
    _MyToken = await erc20contractfactory.attach(contractAddress);

    const delegate = await _MyToken.delegate (signer.address);
    const tx = await delegate.wait();

    setHash(tx.transactionHash);
  }

  async function getBalance() {
    console.log("getBalance");
    //create a provider
    const provider = ethers.getDefaultProvider("goerli");
    const contractAddress = "0x39311Fb4Fc198A6d481Dd7CcA9482EcBD1018F51";

    console.log("contractAddress", contractAddress);
    console.log("randomPrivateKey", randomPrivateKey);
    const wallet = new ethers.Wallet(randomPrivateKey, provider);
    const signer = wallet.connect(provider);
    const erc20contractfactory = new MyToken__factory(signer);
    _MyToken = await erc20contractfactory.attach(contractAddress as string);

    const blnce = await _MyToken.balanceOf(signer.address);
    setBalance(blnce.toString());
  }

  async function getVotesFromBallot() {
    const provider = ethers.getDefaultProvider("goerli");
    console.log("contractAddress", ballot);
    console.log("randomPrivateKey", randomPrivateKey);
    const wallet = new ethers.Wallet(randomPrivateKey, provider);
    const signer = wallet.connect(provider);
    const ballotcontractfactory = new Ballot__factory(signer);
    _Ballot = await ballotcontractfactory.attach(ballot);
    const votePwr = await _Ballot.votePower(signer.address);
    setVotePower(votePwr.toString());
  }

  //Voto in the ballot contract using option
  async function vote(_option: any) {
    //option is the number of the option
    console.log("_option", _option);
    const provider = ethers.getDefaultProvider("goerli");
    console.log("contractAddress", ballot);
    console.log("randomPrivateKey", randomPrivateKey);
    const wallet = new ethers.Wallet(randomPrivateKey, provider);
    const signer = wallet.connect(provider);
    const ballotcontractfactory = new Ballot__factory(signer);
    _Ballot = await ballotcontractfactory.attach(ballot);
    const vote = await _Ballot.vote (  _option ,ethers.utils.parseEther(amount));
    console.log("vote", vote);
  }

  //get winner
  async function getWinner()  {
    const provider = ethers.getDefaultProvider("goerli");
    console.log("contractAddress", ballot);
    console.log("randomPrivateKey", randomPrivateKey);
    const wallet = new ethers.Wallet(randomPrivateKey, provider);
    const signer = wallet.connect(provider);
    const ballotcontractfactory = new Ballot__factory(signer);
    _Ballot = await ballotcontractfactory.attach(ballot);
    const winner = await _Ballot.winnerName();
    console.log("winner", ethers.utils.parseBytes32String(winner));
    setWinnerName(ethers.utils.parseBytes32String(winner));
  }

    
    

  return (

    <div className="container-fluid">
      <Head>
        <title>Ballot token</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Ballot Contract</h1>
          <input type="text" className="form-control"
             value={ballot}           
            onChange={(e) => {
              setBallot(e.target.value);
              e.target.value !== "" ? document.getElementById("create")?.removeAttribute("hidden") : document.getElementById("create")?.setAttribute("hidden", "hidden");
              e.target.value !== "" ? document.getElementById("result")?.removeAttribute("hidden") : document.getElementById("result")?.setAttribute("hidden", "hidden");
            }} 
            placeholder="Place ballot contract address here" />
        </div>
      </section>

      <div className="album py-5 bg-light">
        <div className="row">

          <div className="col-sm">
            <h2>Create Wallet</h2>
            <p>Create a random wallet</p>
            <button id="create" className='btn btn-primary' onClick={createwallet} hidden>Create wallet</button>
            <p>Address: {address}</p>
            <p>ETH Balance: {ethBalance} wei</p>
          </div>

          <div className="col-sm">
            <h2>Request tokens</h2>
            <p>Request tokens to be minted in the backend</p>
            <button id="request" className='btn btn-primary' onClick={requestTokens} hidden>Request</button>
            <p>{ status == "Done! Check your balance." ? status : "Please wait until this changes to continue."}</p>
          </div>

          <div className="col-sm">
            <h2>Auto Delegate</h2>
            <p>Auto delegate tokens to get voting rights</p>
            <button id="delegate" className='btn btn-primary' onClick={autoDelegate} hidden>Delegate</button>
            <p>Fund your account before delegating.</p>
            <p>{ hash ? "Done! Please continue" : "Please wait until this changes to continue."}</p>
          </div>

          <div className="col-sm">
            <h2>Get balance</h2>
            <p>Get the token balance of the connected account</p>
            <button id="balance" className='btn btn-primary' onClick={getBalance} hidden>Get balance</button>
            <p>Balance: {balance}</p>
          </div>

          <div className="col-sm">
            <h2>Voting Power</h2>
            <p>Get voting power left of the connected account</p>         
            <button id="power" className='btn btn-primary' onClick={getVotesFromBallot} hidden>Get Votes</button>
            <p>Votes: {votes}</p>
          </div>

          <div className="col-xl">
            <h2>Vote</h2>
            <p>Vote using Ballot contract </p>
            <select className="form-select" aria-label="Default select example" onChange={(e) => setOptions(e.target.value)}>
              <option selected>Select proposal</option>
              <option value="0">Vanilla</option>
              <option value="1">Chocolate</option>
              <option value="2">Strawberry</option>
            </select>
            <p>Set number of votes </p>
            <input type="text" className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="amount" />
              <br></br>
            <button id="vote" className='btn btn-primary' onClick={() => vote(options)} hidden>Vote</button>
          </div>

          <div className="col-sm">
            <h2>Results</h2>
            <p>Get winning proposal</p>         
            <button id="result" className='btn btn-primary' onClick={() => getWinner()} hidden>Get proposal</button>
            <p>Winning Proposal: {winnerName}</p>
          </div>

        </div>
      </div>
    </div>
  )

}
