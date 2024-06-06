# Mindplex Token

## Overview
The MindplexToken contract is an ERC20 utility token to be used in the Mindplex platform. It is designed to facilitate transactions and other financial interactions within the Mindplex ecosystem.The project employs a fixed supply of tokens, incorporating functionalities for pausing/unpausing the contract, minting and burning tokens, and enforcing role-based access control to ensure secure and efficient operations. This contract leverages OpenZeppelin libraries to implement these features securely and efficiently.

Recommended Node version is 16.0.0 and above.

## Functional, Technical Requirements
Functional and Technical Requirements can be found in the [Requirements.pdf](/docs/Requirements.md) document

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

# Project structure

The project is implemented using hardhat. You can find the tests under ./test/ drectory which have a 100% coverage. the smart contract is found inside the ./contracts/ folder.