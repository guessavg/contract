# 🧠 Guess Two-Thirds Game – A Web3 Game of Strategy

This is a decentralized application (dApp) implementation of the classic **Guess Two-Thirds of the Average** game, deployed on the Ethereum blockchain.

Players participate by sending any amount of ETH. The player whose contribution is **closest to 2/3 of the average** wins the entire prize pool (minus a 1% fee). The game ends **randomly**, making it unpredictable and fair.

## 🎮 Game Rules

- Players can join the game by sending **any positive amount** of ETH.
- Each address can **only participate once** per game.
- Once the game ends, the winner is determined by:
  - Calculating the **average** of all submitted amounts.
  - Taking **2/3 of the average** as the target.
  - The player whose amount is **closest to the target** wins.
  - If there's a tie, the **earliest participant** wins.

### 🕹️ Game End Condition

- A pseudo-random mechanism determines when the game ends:
  - A number `x ∈ [10, 100]` is generated.
  - Based on the number of participants `n`, a range `[n - x, n + x]` is calculated.
  - If a randomly generated number within this range equals `n`, the game ends.
- This ensures the game usually ends between 10 and 100 players.

## 📜 Smart Contract

The main contract is `GuessTwoThirdsGame.sol`, which includes:

- Player registration and payment handling.
- Randomized game-ending logic using `block.prevrandao` and `blockhash`.
- Winner calculation and payout distribution.
- 1% service fee sent to the contract owner.

The contract uses:

- Solidity `^0.8.19`
- OpenZeppelin’s `ReentrancyGuard` for safety

## 🧪 Testing

This project uses [Hardhat](https://hardhat.org/) and [Ethers.js](https://docs.ethers.org/) for testing.

Run tests with:

```
npx hardhat test
```

Tests include:

- Single player participation
- Prevention of duplicate participation
- Game-ending and winner announcement with randomized end logic

## 🚀 Deployment

You can deploy the contract using Hardhat:

```
npx hardhat run scripts/deploy.js --network <network-name>
```

Make sure your `scripts/deploy.js` is configured correctly with your contract factory and signer.

## 📂 Project Structure

```
guess-2-3-contract/
│
├── contracts/
│   └── GuessTwoThirdsGame.sol     # Main game contract
│
├── test/
│   └── GuessTwoThirdsGame.js      # Mocha/Chai test suite
│
├── scripts/
│   └── deploy.js                  # Deployment script
│
├── hardhat.config.js              # Hardhat configuration
└── package.json                   # Project dependencies and scripts
```

## 📦 Dependencies

```
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

## 🧠 Inspiration

This project is based on a well-known behavioral game theory experiment known as **Guess 2/3 of the Average**, adapted to the blockchain with fair randomness and public verifiability.

## 🛡️ License

This project is open-sourced under the [MIT License](LICENSE).
