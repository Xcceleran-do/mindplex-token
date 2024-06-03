# Mindplex Token

## Overview
The MindplexToken contract is an ERC20 utility token to be used in the Mindplex platform. It is designed to facilitate transactions and other financial interactions within the Mindplex ecosystem.The project employs a fixed supply of tokens, incorporating functionalities for pausing/unpausing the contract, minting and burning tokens, and enforcing role-based access control to ensure secure and efficient operations. This contract leverages OpenZeppelin libraries to implement these features securely and efficiently.

Recommended Node version is 16.0.0 and above.

## Available commands

```bash
# install dependencies
$ npm install

# build for production
$ npm run build

# clean, build, run tests
$ npm run rebuild

# run tests
$ npm run test

# compute tests coverage
$ npm run coverage
```

## Features
- **Maximum Supply**: The token has a fixed maximum supply to be determined on deployment.
- **Initial supply**: The initial supply can be determined on deployment and must be less than the maximum supply. 
- **Pausable**: The contract allows pausing and unpausing of all token transfers.
- **Burnable**: Tokens can be burned, reducing the total supply.
- **Mintable**: New tokens can be minted up to the maximum supply.
- **Access Control**: Specific roles are defined for pausing, unpausing, and minting tokens.
- **Votes**: Integration with ERC20Votes for governance functionalities.

## Roles
- **Admin Role (DEFAULT_ADMIN_ROLE)**: Has the highest level of control over the contract, including managing other roles.
- **Pauser Role (PAUSER_ROLE)**: Can pause and unpause token transfers.
- **Minter Role (MINTER_ROLE)**: Can mint new tokens up to the maximum supply.

The contract is deployed with an initial supply minted to the deployer's address. The maximum number of tokens that can
be minted is also set on deployment.

## Implementation

### State Variables
- `PAUSER_ROLE`: A bytes32 identifier for the pauser role.
- `MINTER_ROLE`: A bytes32 identifier for the minter role.
- `maxSupply`: An immutable uint256 representing the maximum supply of tokens.

### Constructor
```solidity
constructor(
    string memory name_,
    string memory symbol_,
    uint256 maxSupply_,
    uint256 initialSupply
)
```

**Parameters:**
- `name_`: The name of the token.
- `symbol_`: The symbol of the token.
- `maxSupply_`: The maximum supply of the token.
- `initialSupply`: The initial supply to be minted at deployment.

**Functionality:**
- Checks that maxSupply_ and initialSupply are non-zero.
- Sets the maxSupply.
- Grants the deployer the DEFAULT_ADMIN_ROLE, PAUSER_ROLE, and MINTER_ROLE.
- Mints the initialSupply to the deployer.

### Functions
- `function mint(address to, uint256 amount) external whenNotPaused onlyRole(MINTER_ROLE)`: Mints the specified amount of tokens to the given address.
- `function pause() external onlyRole(PAUSER_ROLE)`: Pauses all token transfers.
- `function unpause() external onlyRole(PAUSER_ROLE)`: Unpauses all token transfers.
- `function decimals() public pure override returns (uint8)`: Returns the number of decimals (6) used for token representation.
