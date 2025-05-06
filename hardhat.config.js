require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, BASE_RPC_URL, LOCAL_RPC_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    base: {
      url: BASE_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    local: {
      url: LOCAL_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
