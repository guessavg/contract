const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with address:", deployer.address);

  const Game = await ethers.getContractFactory("GuessTwoThirdsGame");
  const game = await Game.deploy(); 
  await game.waitForDeployment(); 

  console.log("Contract deployed to:", await game.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
