# Mindplex Token

## Overview
The MindplexToken contract is an ERC20 utility token to be used in the Mindplex platform. It is designed to facilitate transactions and other financial interactions within the Mindplex ecosystem.The project employs a fixed supply of tokens, incorporating functionalities for pausing/unpausing the contract, minting and burning tokens, and enforcing role-based access control to ensure secure and efficient operations. This contract leverages OpenZeppelin libraries to implement these features securely and efficiently.

Recommended Node version is 16.0.0 and above.

## Functional, Technical Requirements
Functional and Technical Requirements can be found in the [Requirements.pdf](/docs/Requirements.md) document

## Available commands

1. Install dependencies
```bash
    npm install
```

2. Compile project
```bash
    npx hardhat compile
```

3. Run Tests
```bash
    npx hardhat test
```


## Roles
The mindplex token contract defines 3 roles:
- `DEFAULT_ADMIN_ROLE`: Has the ability to manage other roles.
- `PAUSER_ROLE`: Authorized to pause and unpause token transfers.
- `MINTER_ROLE`: Authorized to mint new tokens.


## Project structure

```tree
.
├── contracts
│   └── MindplexToken.sol  # Main token contract
└── test
|   └── MindplexToken.js   # Tests for the token contract
└── docs             
    └── Requirements.md    # Functional and technical requirements
├── hardhat.config.js
├── package-lock.json
├── package.json
├── README.md
```

## Technologies Used
- Programming Languages & Development tools
    - Solidity: The primary programming language used for smart contract development.
    - Hardhat: A comprehensive development environment for compiling, testing, and deploying smart contracts.
    - Javascript: Utilized for writing tests and scripts to interact with the smart contracts.
- Libraries

## Contract Information

### Assets

- `maxSupply` is defined to determine the maximum supply of tokens and is set during contract deployment.

### Events

- No custom events are defined beyond those inherited from OpenZeppelin contracts.

### Modifiers

- **whenNotPaused**: Ensures that a function can only be called when the contract is not paused.
- **onlyRole**: Ensures that a function can only be called by an account with a specific role.

### Functions

- **constructor(string memory name_, string memory symbol_, uint256 maxSupply_)**: Initializes the contract with a name, symbol, and maximum supply, and assigns initial roles.
- **mint(address to, uint256 amount)**: Mints new tokens to a specified address, only callable by accounts with the MINTER_ROLE.
- **pause()**: Pauses all token transfers, only callable by accounts with the PAUSER_ROLE.
- **unpause()**: Unpauses all token transfers, only callable by accounts with the PAUSER_ROLE.
- **decimals() public pure override returns (uint8)**: Returns the number of decimals used for token representation (fixed at 6).
- **_beforeTokenTransfer(address from, address to, uint256 amount) internal override**: Hook that is called before any transfer of tokens, pausing if necessary.
- **_afterTokenTransfer(address from, address to, uint256 amount) internal override**: Hook that is called after any transfer of tokens, managing voting power changes.
- **_mint(address account, uint256 amount) internal override**: Hook that is called when tokens are minted.
- **_burn(address account, uint256 amount) internal override**: Hook that is called when tokens are burned.



 
