import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("@nomiclabs/hardhat-ethers");
 require("@nomiclabs/hardhat-etherscan");
 require("@nomicfoundation/hardhat-toolbox");
 require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: { tests: "tests" },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      //ankr's free public rpc
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [`0x${process.env.PRIVATE_KEY1}`],
    },
    goerli: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY1}`]
   },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
};

export default config;
