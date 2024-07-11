# Table of Contents
- [Table of Contents](#table-of-contents)
- [Functional Requirements](#functional-requirements)
  - [Features](#features)
  - [Roles](#roles)
- [Technical Requirements](#technical-requirements)
  - [Project structure](#project-structure)
  - [Solidity API](#solidity-api)
    - [MindplexToken](#mindplextoken)
    - [Variables](#variables)
      - [PAUSER\_ROLE](#pauser_role)
      - [MINTER\_ROLE](#minter_role)
      - [MAX\_SUPPLY](#max_supply)
    - [Functions](#functions)
      - [constructor](#constructor)
      - [mint](#mint)
      - [pause](#pause)
      - [unpause](#unpause)
      - [decimals](#decimals)
      - [\_beforeTokenTransfer](#_beforetokentransfer)
      - [\_afterTokenTransfer](#_aftertokentransfer)
      - [\_mint](#_mint)
      - [\_burn](#_burn)



# Functional Requirements

## Features

- **Mintable**: The token can be minted up to a fixed maximum supply set during deployment.
- **Burnable**: Holders can burn their tokens.
- **Pausable**: The contract can be paused and unpaused by the authorized role, which stops all token transfers.
- **Access Control**: Specific functionalities are restricted to users with certain roles.
- 
## Roles
The mindplex token contract defines 3 roles:
- `DEFAULT_ADMIN_ROLE`: Has the ability to manage other roles.
- `PAUSER_ROLE`: Authorized to pause and unpause token transfers.
- `MINTER_ROLE`: Authorized to mint new tokens.

# Technical Requirements



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


## Solidity API

### MindplexToken

This contract represents an ERC20 utility token. The contract has a fixed supply of tokens including functionalities:
 - To pause/unpause the contract
 - To burn and mint tokens
 - To restrict functionality access for only specific roles

### Variables

#### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

#### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

#### MAX_SUPPLY

```solidity
uint256 MAX_SUPPLY
```

### Functions

#### constructor

```solidity
constructor(string name_, string symbol_) public
```

#### mint

```solidity
function mint(address to, uint256 amount) external
```

#### pause

```solidity
function pause() external
```

_Pauses all token transfers.

See {Pausable-_pause}.

Requirements:

- The caller must have the `PAUSER_ROLE`.
- The contract must not be in paused state_

#### unpause

```solidity
function unpause() external
```

_Unpauses all token transfers.

See {Pausable-_unpause}.

Requirements:

- The caller must have the `PAUSER_ROLE`.
- The contract must be in paused state_

#### decimals

```solidity
function decimals() public pure returns (uint8)
```

_Returns the number of decimals `6` used to get its user representation.
See {ERC20-decimals}_

#### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```

_See {ERC20-_beforeTokenTransfer}.

Requirements:

- the contract must not be paused._

#### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal
```

_Move voting power when tokens are transferred.

Emits a {IVotes-DelegateVotesChanged} event._

#### _mint

```solidity
function _mint(address account, uint256 amount) internal
```

_Snapshots the totalSupply after it has been increased._

#### _burn

```solidity
function _burn(address account, uint256 amount) internal
```

_Snapshots the totalSupply after it has been decreased._
