import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("@nomiclabs/hardhat-ethers");
 require("@nomiclabs/hardhat-etherscan");
 require("@nomicfoundation/hardhat-toolbox");
 require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
