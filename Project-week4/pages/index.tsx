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

    const balance = await _MyToken.balanceOf(signer.address);
    console.log("balance", balance.toString());

  }
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
    console.log(ethBalance);
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
    } catch (error) {
      console.error(error);
    }
    //after the transaction you can call getBalance

  }
  async function getVotesFromBallot() {
    const provider = ethers.getDefaultProvider("goerli");
    console.log("contractAddress", ballot);
    console.log("randomPrivateKey", randomPrivateKey);
    const wallet = new ethers.Wallet(randomPrivateKey, provider);
    const signer = wallet.connect(provider);
    const ballotcontractfactory = new Ballot__factory(signer);
    _Ballot = await ballotcontractfactory.attach(ballot);
    const votePower = await _Ballot.votePower(signer.address);
    console.log("votePower", votePower.toString());
  
  }
  //get proposal
  async function getProposal( _numero: any)  {
    const provider = ethers.getDefaultProvider("goerli");
    console.log("contractAddress", ballot);
    console.log("randomPrivateKey", randomPrivateKey);
    const wallet = new ethers.Wallet(randomPrivateKey, provider);
    const signer = wallet.connect(provider);
    const ballotcontractfactory = new Ballot__factory(signer);
    _Ballot = await ballotcontractfactory.attach(ballot);
    const proposals = await _Ballot.proposals(_numero);
    console.log("proposals", proposals);

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
    console.log("transactionHash", tx.transactionHash );
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
          <h1 className="jumbotron-heading">Ballot token</h1>
          <input type="text" className="form-control"
             value={ballot}           
            onChange={(e) => setBallot(e.target.value)} 
            placeholder="Ballot address" />
          <p>
            <a href="#" className="btn btn-primary my-2">Main call to action</a>
            <a href="#" className="btn btn-secondary my-2">Secondary action</a>
          </p>
        </div>
      </section>

      <div className="album py-5 bg-light">
        <div className="row">

          <div className="col-sm">
            <h2>Ballot token</h2>
            <p>Get votes from ballot contract</p>         
            <button className='btn btn-primary' onClick={getVotesFromBallot}>Get Votes</button>
            <p>Votes: {votes}</p>
          </div>
          <div className="col-sm">
            <h2>Ballot token</h2>
            <p>Get proposal</p>         
            <button className='btn btn-primary' onClick={() => getProposal(0)}>Get proposal</button>
            <p>Proposal: {votes}</p>
          </div>
          <div className="col-xl">
            <h2>Ballot token</h2>
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
            <button className='btn btn-primary' onClick={() => vote(options)}>Vote</button>
          </div>
          <div className="col-sm">
            <h2>Request tokens</h2>
            <p>Request tokens to be minted in the backend</p>
            <button className='btn btn-primary' onClick={requestTokens}>Request</button>
          </div>
          <div className="col-sm">
            <h2>Auto delegate tokens</h2>
            <p>Auto delegate tokens to the ballot contract</p>
            <button className='btn btn-primary' onClick={autoDelegate}>Delegate</button>
          </div>

          <div className="col-sm">
            <h2>Get balance</h2>
            <p>Get the balance of the connected account</p>
            <button className='btn btn-primary' onClick={getBalance}>Get balance</button>
          </div>
          <div className="col-sm">
            <h2>Create wallet</h2>
            <p>Create a random wallet</p>
            <button className='btn btn-primary' onClick={createwallet}>Create wallet</button>
            <p>Address: {address}</p>
          </div>
        </div>
      </div>
    </div>
  )

}
