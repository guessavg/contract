// scripts/deploy.js
// Deploys GuessTwoThirdsGame(minX, maxX)
// Usage:
//   npx hardhat run --network <network> scripts/deploy.js <minX> <maxX>
// Example:
//   npx hardhat run --network sepolia scripts/deploy.js 2 3

const { ethers } = require("hardhat");

async function main() {
  /* --------------------------------------------------------------------- */
  /*                     1. Parse constructor arguments                    */
  /* --------------------------------------------------------------------- */

  // Command‑line arguments after the script name
  const cliArgs = process.argv.slice(2);
  const minX = cliArgs[0] ? Number(cliArgs[0]) : 2;   // default 2
  const maxX = cliArgs[1] ? Number(cliArgs[1]) : 3;   // default 3

  if (
    !Number.isInteger(minX) ||
    !Number.isInteger(maxX) ||
    minX <= 0 ||
    maxX < minX
  ) {
    throw new Error(
      "Invalid arguments. Usage: node deploy.js <minX> <maxX>  (minX ≥ 1, maxX ≥ minX)"
    );
  }

  /* --------------------------------------------------------------------- */
  /*                          2. Deploy the contract                       */
  /* --------------------------------------------------------------------- */

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(`Constructor params → minX = ${minX}, maxX = ${maxX}`);

  const Game = await ethers.getContractFactory("GuessTwoThirdsGame");
  const game = await Game.deploy(minX, maxX);
  await game.waitForDeployment();                // ensures the tx is mined

  console.log("GuessTwoThirdsGame deployed to:", await game.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
