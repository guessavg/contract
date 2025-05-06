# 🧠 Guess Two‑Thirds Game – A Web3 Game of Strategy

This repository contains a decentralized implementation of the classic **Guess Two‑Thirds of the Average** game, running on the Ethereum blockchain.

Players join by sending any amount of ETH. When the round ends, the player whose contribution is **closest to  2 / 3  of the average** wins the entire prize pool (minus a 1 % owner fee).  
The stop‑condition is pseudo‑random and **parametrised on deployment**, so the game designer can decide how quickly a round should finish (e.g. 2–3 players, 5–10 players, etc.).

---

## 🎮 Game Rules

- Join by sending **any positive amount** of ETH.
- Each address may **participate only once per round**.
- When the round ends:
  1. Compute the **average** of all submitted amounts.  
  2. Take **2 / 3  of that average** as the target.  
  3. The player whose amount is **closest to the target** wins.  
  4. If there is a tie, the **earliest participant** wins.

### 🕹️ How the Game Ends

- At deployment you choose `minX` and `maxX` (both ≥ 1, `minX ≤ maxX`).  
- For every new participant count `n`, the contract draws  
  `x  ∈  [minX, maxX]` using on‑chain randomness (`block.prevrandao` & block hash).
- The game **cannot** end before `x` players have joined.  
- After that, another pseudo‑random draw decides whether the current `n` is the final count.  
- With `minX = 2, maxX = 3` (recommended for demos), a round typically ends within 6–9 players.

---

## 📜 Smart Contract

Main file: `contracts/GuessTwoThirdsGame.sol`

Features:

- Player registration, payment handling, and “one‑address‑one‑entry” guard.
- Constructor **`GuessTwoThirdsGame(uint256 minX, uint256 maxX)`** sets the early‑stop range.
- Pseudo‑random end logic based on `block.prevrandao` and `blockhash`.
- Automatic prize/fee distribution (1 % fee to `owner`).
- Written in **Solidity ^0.8.19** – uses OpenZeppelin’s `ReentrancyGuard`.

---

## 🧪 Testing

This project uses [Hardhat] and [Ethers.js].

Run the full suite with:

```
npx hardhat test
```

Tests check:

- Single‑player participation
- Rejection of duplicate participation
- Round termination and winner determination under the new, quicker stop‑condition

---

## 🚀 Deployment

Deploy with the Hardhat script, passing `minX` and `maxX` on the command line:

```
npx hardhat run --network <network-name> scripts/deploy.js <minX> <maxX>
```

Example (2–3 player threshold on Sepolia):

```
npx hardhat run --network sepolia scripts/deploy.js 2 3
```

---

## 📂 Project Structure

```
guess-two-thirds-game/
│
├── contracts/
│   └── GuessTwoThirdsGame.sol     # Main game contract
│
├── test/
│   └── GuessTwoThirdsGame.js      # Mocha/Chai test suite
│
├── scripts/
│   └── deploy.js                  # Deployment script (takes minX, maxX)
│
├── hardhat.config.js              # Hardhat configuration
└── package.json                   # Dependencies and scripts
```

---

## 📦 Dependencies

```
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

---

## 🧠 Inspiration

The contract brings the classic experimental‑economics game **“Guess 2 / 3 of the Average”** to Web3, ensuring fairness through on‑chain pseudo‑randomness and public verifiability.

---

## 🛡️ License

Distributed under the [MIT License](./LICENSE).
