# Mindplex Token
## Overview
The MindplexToken contract is an ERC20 utility token to be used in the Mindplex platform. Additional functionalities include pausing and unpausing transfers, burning and minting tokens, and role-based access control for certain operations. This contract leverages OpenZeppelin libraries to implement these features securely and efficiently.

## Features
- **Fixed Supply**: The token has a fixed maximum supply of 1,000,000,000 tokens.
- **Pausable**: The contract allows pausing and unpausing of all token transfers.
- **Burnable**: Tokens can be burned, reducing the total supply.
- **Mintable**: New tokens can be minted up to the maximum supply.
- **Access Control**: Specific roles are defined for pausing, unpausing, and minting tokens.
- **Votes**: Integration with ERC20Votes for governance functionalities.
## Roles
- **Admin Role (DEFAULT_ADMIN_ROLE)**: Has the highest level of control over the contract, including managing other roles.
**Pauser Role (PAUSER_ROLE)**: Can pause and unpause token transfers.
**Minter Role (MINTER_ROLE)**: Can mint new tokens up to the maximum supply.

The contract is deployed with an initial supply of the maximum number of tokens minted to the deployer's address.

