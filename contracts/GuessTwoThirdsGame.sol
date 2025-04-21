// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GuessTwoThirdsGame
 * @dev A blockchain implementation of the “two‑thirds of the average” game.
 *      – Each unique address may join once per round by sending any positive ETH amount.
 *      – When the random stop‑condition is met, the player whose amount is
 *        closest to ⌊2 / 3 × average⌋ wins the prize pool (minus a 1 % fee).
 *      – If several players are equally close, the earliest participant wins.
 */
contract GuessTwoThirdsGame is ReentrancyGuard {
    struct Player {
        address addr;
        uint256 amount;
    }

    Player[] public players;
    mapping(address => bool) public hasPlayed;

    uint256 public totalAmount;
    uint256 public gameId;
    address public immutable owner;

    event PlayerJoined(address indexed player, uint256 amount);
    event GameEnded(
        uint256 indexed gameId,
        address indexed winner,
        uint256 reward,
        uint256 guessTarget
    );

    constructor() {
        owner = msg.sender;
        gameId = 1;
    }

    /**
     * @notice Join the current round.
     * @dev Re‑entrancy is blocked via `nonReentrant`.
     */
    function play() external payable nonReentrant {
        require(!hasPlayed[msg.sender], "You already played");
        require(msg.value > 0, "Must send ETH");

        // Store participation
        players.push(Player(msg.sender, msg.value));
        hasPlayed[msg.sender] = true;
        totalAmount += msg.value;

        emit PlayerJoined(msg.sender, msg.value);

        // Potentially end the game
        if (_shouldEndGame(players.length)) {
            _endGame();
        }
    }

    /* --------------------------------------------------------------------- */
    /*                          Internal logic                               */
    /* --------------------------------------------------------------------- */

    /// Pseudo‑random stop condition (≈10–100 players).
    function _shouldEndGame(uint256 n) internal view returns (bool) {
        // x ∈ [10,100]
        uint256 x = 10 +
            (uint256(
                keccak256(
                    abi.encodePacked(block.prevrandao, block.timestamp, n)
                )
            ) % 91);

        if (n < x) return false; // still too early

        uint256 l = n > x ? n - x : 1; // lower bound
        uint256 r = n + x; // upper bound
        uint256 y = l +
            (uint256(
                keccak256(
                    abi.encodePacked(blockhash(block.number - 1), msg.sender)
                )
            ) % (r - l + 1));

        return y == n;
    }

    /// Distribute prize, charge 1 % fee, reset state.
    function _endGame() internal {
        uint256 average = totalAmount / players.length;
        uint256 target = (average * 2) / 3; // ⌊2/3 × average⌋

        // Determine winner (earliest wins ties)
        address winner = players[0].addr;
        uint256 closestDiff = _absDiff(players[0].amount, target);

        for (uint256 i = 1; i < players.length; ++i) {
            uint256 diff = _absDiff(players[i].amount, target);
            if (diff < closestDiff) {
                winner = players[i].addr;
                closestDiff = diff;
            }
        }

        uint256 serviceFee = totalAmount / 100; // 1 %
        uint256 prize = totalAmount - serviceFee;

        // Payouts
        (bool okWinner, ) = payable(winner).call{value: prize}("");
        require(okWinner, "Prize transfer failed");

        (bool okOwner, ) = payable(owner).call{value: serviceFee}("");
        require(okOwner, "Fee transfer failed");

        emit GameEnded(gameId, winner, prize, target);

        // Reset for next round
        for (uint256 i = 0; i < players.length; ++i) {
            hasPlayed[players[i].addr] = false;
        }
        delete players;
        totalAmount = 0;
        ++gameId;
    }

    function _absDiff(uint256 a, uint256 b) private pure returns (uint256) {
        return a > b ? a - b : b - a;
    }

    /* --------------------------------------------------------------------- */

    receive() external payable {}
}
