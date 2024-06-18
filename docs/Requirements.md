
# Functional Requirements

- **Mintable**: The token can be minted up to a fixed maximum supply set during deployment.
- **Burnable**: Holders can burn their tokens.
- **Pausable**: The contract can be paused and unpaused by the authorized role, which stops all token transfers.
- **Access Control**: Specific functionalities are restricted to users with certain roles.

# Technical Requirements

- An authorized minter mints new tokens to an address.The caller must have the MINTER_ROLE and the contract must not be paused. The specified address receives the minted tokens, and the total supply increases up to the maximum supply.
- A token holder burns their tokens. The caller must hold enough tokens to burn. The caller’s balance will decrease by the burned amount, and the total supply is reduced accordingly.
- An authorized pauser pauses or unpauses the contract. The caller must have the PAUSER_ROLE. All token transfers will be stopped (paused) or resumed (unpaused).
- An admin manages roles within the contract. The caller must have the DEFAULT_ADMIN_ROLE and roles are granted or revoked to/from specific addresses, controlling access to restricted functions.
- A user transfers tokens to another user. The contract must not be paused, and the sender must have enough tokens to transfer. The sender's balance decreases by the transferred amount, and the recipient's balance increases by the same amount.
