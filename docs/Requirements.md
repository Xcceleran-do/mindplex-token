# Mindplex Token README

## Functional Requirements

### 1.1. Roles
The mindplex token contract defines 3 roles:
- `DEFAULT_ADMIN_ROLE`: Has the ability to manage other roles.
- `PAUSER_ROLE`: Authorized to pause and unpause token transfers.
- `MINTER_ROLE`: Authorized to mint new tokens.

### 1.2. Features

- **Mintable**: The token can be minted up to a fixed maximum supply set during deployment.
- **Burnable**: Holders can burn their tokens.
- **Pausable**: The contract can be paused and unpaused by the authorized role, which stops all token transfers.
- **Access Control**: Specific functionalities are restricted to users with certain roles.

### 1.3. Use Cases

- An authorized minter mints new tokens to an address.The caller must have the MINTER_ROLE and the contract must not be paused. The specified address receives the minted tokens, and the total supply increases up to the maximum supply.
- A token holder burns their tokens. The caller must hold enough tokens to burn. The caller’s balance will decrease by the burned amount, and the total supply is reduced accordingly.
- An authorized pauser pauses or unpauses the contract. The caller must have the PAUSER_ROLE. All token transfers will be stopped (paused) or resumed (unpaused).
- An admin manages roles within the contract. The caller must have the DEFAULT_ADMIN_ROLE and roles are granted or revoked to/from specific addresses, controlling access to restricted functions.
- A user transfers tokens to another user. The contract must not be paused, and the sender must have enough tokens to transfer. The sender's balance decreases by the transferred amount, and the recipient's balance increases by the same amount.

## Technical Requirements

The Mindplex Token contract is built using Solidity and extends several OpenZeppelin contracts to provide a secure and feature-rich ERC20 token implementation. Key functionalities include pausing, minting, and burning capabilities, all managed through a role-based access control system.

The project directory looks like This
```tree
.
├── contracts
│   └── MindplexToken.sol
└── test
    └── MindplexToken.js
├── hardhat.config.js
├── package-lock.json
├── package.json
├── README.md
```

The project directory is set up to make creating and testing smart contracts easier. The MindplexToken.sol file, which describes the Mindplex Token's smart contract logic, is located in the contracts folder. The MindplexToken.js file, which provides tests to make sure the contract operates as intended, is located in the test directory. The configuration file for Hardhat, a development environment for building, deploying, testing, and debugging Ethereum apps, is hardhat.config.js. The project's dependencies while scripts are managed by the package.json and package-lock.json files, which also make sure that all necessary libraries and tools are installed and maintained. Lastly, documentation and usage guidelines for the project are included in the README.md file.

### 2.1. Contract Information

##### 2.1.1. Assets

- `maxSupply` is defined to determine the maximum supply of tokens and is set during contract deployment.

##### 2.1.1.2. Events

- No custom events are defined beyond those inherited from OpenZeppelin contracts.

##### 2.1.1.3. Modifiers

- **whenNotPaused**: Ensures that a function can only be called when the contract is not paused.
- **onlyRole**: Ensures that a function can only be called by an account with a specific role.

##### 2.1.1.4. Functions

- **constructor(string memory name_, string memory symbol_, uint256 maxSupply_)**: Initializes the contract with a name, symbol, and maximum supply, and assigns initial roles.
- **mint(address to, uint256 amount)**: Mints new tokens to a specified address, only callable by accounts with the MINTER_ROLE.
- **pause()**: Pauses all token transfers, only callable by accounts with the PAUSER_ROLE.
- **unpause()**: Unpauses all token transfers, only callable by accounts with the PAUSER_ROLE.
- **decimals() public pure override returns (uint8)**: Returns the number of decimals used for token representation (fixed at 6).
- **_beforeTokenTransfer(address from, address to, uint256 amount) internal override**: Hook that is called before any transfer of tokens, pausing if necessary.
- **_afterTokenTransfer(address from, address to, uint256 amount) internal override**: Hook that is called after any transfer of tokens, managing voting power changes.
- **_mint(address account, uint256 amount) internal override**: Hook that is called when tokens are minted.
- **_burn(address account, uint256 amount) internal override**: Hook that is called when tokens are burned.

