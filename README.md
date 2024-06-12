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

# Project structure

The project is implemented using hardhat. You can find the tests under ./test/ drectory which have a 100% coverage. the smart contract is found inside the ./contracts/ folder.

## Technologies Used
- Programming Languages & Development tools
    - Solidity: The primary programming language used for smart contract development.
    - Hardhat: A comprehensive development environment for compiling, testing, and deploying smart contracts.
    - Javascript: Utilized for writing tests and scripts to interact with the smart contracts.
- Libraries

    - Openzeppelin: A library for secure smart contract development, providing reusable and tested modules.