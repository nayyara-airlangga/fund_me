require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    kovan: {
      url: process.env.KOVAN_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      ethUSDPriceFeed: "0x9326bfa02add2366b30bacb125260af641031331",
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
