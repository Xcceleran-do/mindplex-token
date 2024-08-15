// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 *  @title Mindplex Token
 *  @notice This contract represents an {ERC20} utility token
 *  @dev This contract is a fixed supply of {ERC20} token including functionalities:
 *  - To pause and unpause the contract
 *  - To burn and mint tokens
 *  - To restrict functionality access for only specific roles
*/
contract MindplexToken is 
    ERC20Burnable, 
    ERC20Votes,
    Pausable, 
    AccessControl 
{
    // Role that has the access to pause and unpause this contract
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    // Role that has the access to mint tokens on this contract 
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    // Max supply of the token
    uint256 public immutable maxSupply;

    //------------------------------- Constructor -----------------------------// 

    constructor(
        string memory name_, 
        string memory symbol_,
        uint256 maxSupply_,
        uint256 initialSupply
    ) 
        ERC20(name_, symbol_)
        ERC20Permit(name_)
    { 
        _checkNonZero(maxSupply_);
        _checkNonZero(initialSupply);
        require(initialSupply <= maxSupply_, "Initial supply exceeds max limit");

        maxSupply = maxSupply_;
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(PAUSER_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
        _mint(_msgSender(), initialSupply); // Minting initial Supply
    }

    //------------------------------- EXTERNAL -----------------------------// 

    function mint(
        address to, 
        uint256 amount
    ) 
        external 
        whenNotPaused
        onlyRole(MINTER_ROLE) 
    {
        require(
            totalSupply() + amount <= maxSupply,
            "Token to be minted should not exceed Max supply"
        ); 
        _mint(to, amount);
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {Pausable-_pause}.
     *
     * Requirements:
     *
     * - The caller must have the `PAUSER_ROLE`.
     * - The contract must not be in paused state 
    */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - The caller must have the `PAUSER_ROLE`.
     * - The contract must be in paused state 
    */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    //------------------------------- PUBLIC -----------------------------// 

    /**
    * @dev Returns the number of decimals `6` used to get its user representation.
    * See {ERC20-decimals}
    */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    //------------------------------- INTERNAL -----------------------------// 

    /**
     * @dev See {ERC20-_beforeTokenTransfer}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
    */
    function _beforeTokenTransfer(
        address from, 
        address to, 
        uint256 amount
    ) 
        internal 
        override
        whenNotPaused 
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Move voting power when tokens are transferred.
     *
     * Emits a {IVotes-DelegateVotesChanged} event.
    */
    function _afterTokenTransfer(
        address from, 
        address to, 
        uint256 amount
    ) 
        internal 
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    /**
     * @dev Snapshots the totalSupply after it has been increased.
     */
    function _mint(
        address account, 
        uint256 amount
    ) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._mint(account, amount);
    }

    /**
     * @dev Snapshots the totalSupply after it has been decreased.
     */
    function _burn(
        address account, 
        uint256 amount
    ) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._burn(account, amount);
    }

    //------------------------------- HELPERS -----------------------------// 

    function _checkNonZero(uint256 amount) private pure {
        require(amount > 0, "Zero amount");   
    }
}