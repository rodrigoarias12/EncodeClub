import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
//add ethers
import { BigNumber, ethers } from "ethers";
import { useAccount, useClient } from "wagmi";
import { useEffect, useState } from "react";
export default function Home() {
  // use state to store the value of the input
  const [input, setInput] = useState("");
  const { isConnected } = useAccount();
  //create a provider
  const provider = ethers.getDefaultProvider("goerli");
  //create address random
  var random;
  var randomAddress;
  var randomPrivateKey;
  var randomMnemonic;
  var randomSigner;
  var ethBalance = 0;

  function getBalance() {
    console.log("getBalance");
    console.log(ethBalance);
  }
  async function createwallet() {
    console.log("createwallet");
    const random = await ethers.Wallet.createRandom();
    console.log(random);
    setInput(random.address);
    const randomAddress = random.address;
    const randomPrivateKey = random.privateKey;
    const randomMnemonic = random.mnemonic;
    const randomSigner = await random.connect(provider);
    const ethBalance = await randomSigner.getBalance();
    console.log(ethBalance);
  }
  function requestTokens() {
    //todo: request tokens to be minted in the backend
    console.log("requestTokens");
    //after the transaction you can call getBalance

  }
  function connectBallot() {
    //TODO: connect to the ballot contract
    console.log("connectBallot");

  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          Welcome your wallet address is  {input}
        </p>
        <p className={styles.description}>
          <button onClick={createwallet}>Create  wallet</button>
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>


      </main>

      <footer className={styles.footer}>

        <span className={styles.logo}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </footer>
    </div>
  )
}
