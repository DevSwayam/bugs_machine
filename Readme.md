### Slot Machine Game Information Document

<a href="https://www.loom.com/share/04dd6d0a33da470986bc136882a31846?sid=2a9ab5fc-9c30-40d0-af98-aac348d1ea45" target="_blank">Demo Link to Understand</a>

#### Overview
The Slot Machine Game is a decentralized on-chain game that leverages the Inco network to generate random numbers in a secure and transparent manner. The game is deployed on the Red Stone platform and utilizes Hyperlane infrastructure to bridge users' tokens from Red Stone to Inco. The randomness of the game ensures fairness, as even the game developers do not know the winning number. As players participate, the number of Bugs (in-game tokens) locked in the smart contract increases, boosting the jackpot rewards.

#### Key Features
- **Random Number Generation**: The game generates a random number between 0 and 65,535 using Inco's secure and secretive method.
- **Transparent and Fair**: The game’s randomness ensures transparency and fairness, with no possibility of manipulation.
- **Growing Jackpot**: As more users play without winning, the jackpot amount increases.
- **Constant Fees**: The betting fee remains constant, irrespective of the growing jackpot.
- **Cross-Platform Integration**: Utilizes Hyperlane to bridge tokens between Red Stone and Inco.

#### Game Mechanics
1. **Starting the Game**: The game starts with an initial balance of 5,000 Bugs.
2. **Betting**: Players can place a bet of 2 Bugs to participate in the game.
3. **Generating Random Number**: For each bet, Inco generates a random number between 0 and 65,535.
4. **Winning Criteria**: If a player’s generated number matches the pre-defined winning number (e.g., 1000), the player wins the jackpot.
5. **Increasing Jackpot**: If no player wins, the jackpot increases as follows:
   - Initial Jackpot: 5,000 Bugs.
   - Each Bet: 2 Bugs added.
   - For instance, if 100 users play without winning, the jackpot increases by 200 Bugs (100 users * 2 Bugs each), making the new jackpot 5,200 Bugs.
6. **Payout**: If a player wins, they receive the current jackpot amount. For example, if it’s the first user and they win, they get 5,002 Bugs (5,000 initial balance + 2 Bugs from their bet).

#### Playing the Game
1. **Deposit Bugs**: Players deposit their Bugs into the Inco network.
2. **Bet Placement**: Players place their bets on the slot machine game deployed on Red Stone.
3. **Random Number Generation**: Inco generates a random number for each bet placed.
4. **Winning Check**: The system checks if the generated number matches the winning number.
5. **Jackpot Adjustment**: If no win, the jackpot increases; if a win, the winner receives the jackpot.

#### Benefits
- **Fair and Secure**: Uses advanced cryptographic techniques for random number generation, ensuring fairness.
- **Transparency**: The game’s mechanics and jackpot growth are visible on-chain, providing transparency to all participants.
- **Incentive to Play**: Increasing jackpot encourages more players to participate.

#### Example Scenario
- Initial Balance: 5,000 Bugs.
- Betting Amount: 2 Bugs.
- User 1 places a bet and wins: They receive 5,002 Bugs.
- If no one wins after 100 plays, the jackpot becomes 5,200 Bugs.
- User 101 wins: They receive 5,202 Bugs.

By providing a secure and transparent gaming experience with a growing jackpot, the Slot Machine Game aims to attract a large number of participants, offering them a fair chance to win significant rewards.

#### Conclusion
The Slot Machine Game combines the excitement of betting with the security and transparency of blockchain technology. With its fair random number generation and ever-increasing jackpot, it provides an engaging and potentially rewarding experience for all players.
