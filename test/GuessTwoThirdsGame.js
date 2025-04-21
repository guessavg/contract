/* eslint-env mocha */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GuessTwoThirdsGame", function () {
  let game, owner, player1, player2, player3;

  beforeEach(async () => {
    const Game = await ethers.getContractFactory("GuessTwoThirdsGame");
    [owner, player1, player2, player3] = await ethers.getSigners();
    game = await Game.deploy();
  });

  it("allows a player to join", async () => {
    await expect(
      game.connect(player1).play({ value: ethers.parseEther("1") })
    ).to.emit(game, "PlayerJoined");

    expect(await game.hasPlayed(player1.address)).to.be.true;
  });

  it("rejects duplicate participation from same address", async () => {
    await game.connect(player1).play({ value: ethers.parseEther("1") });

    await expect(
      game.connect(player1).play({ value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("You already played");
  });

  it("eventually ends the game and emits GameEnded", async () => {
    // Seed with three known players
    await game.connect(player1).play({ value: ethers.parseEther("1") });
    await game.connect(player2).play({ value: ethers.parseEther("2") });
    await game.connect(player3).play({ value: ethers.parseEther("0.5") });

    let ended = false;

    // Keep adding *fresh* wallets until the game stops (hard‑limit 500)
    for (let i = 0; i < 500 && !ended; ++i) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);

      // Fund the wallet from the owner so it can pay gas + stake
      await owner.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther("3"),
      });

      const tx = await game
        .connect(wallet)
        .play({ value: ethers.parseEther("1") });
      const receipt = await tx.wait();

      // Look for GameEnded event in this tx
      for (const log of receipt.logs) {
        try {
          const parsed = game.interface.parseLog(log);
          if (parsed && parsed.name === "GameEnded") {
            console.log(
              `✅ Game ended after ${await game.gameId()} rounds – winner ${
                parsed.args.winner
              } got ${ethers.formatEther(parsed.args.reward)} ETH`
            );
            ended = true;
            break;
          }
        } catch (_) {
          /* not our event – skip */
        }
      }
    }

    expect(ended, "Game did not finish within 500 players").to.be.true;
  });
});
