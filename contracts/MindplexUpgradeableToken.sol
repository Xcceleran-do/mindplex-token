// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";






/**

 *  @title MindplexUpgradeableToken
 *  @notice This contract represents an {ERC20} utility token
 *  @dev This contract is a fixed supply of {ERC20} token including functionalities:
 *                   - To pause and unpause the contract
 *                   - To burn and mint tokens
 *                   - To restrict functionality access for only specific roles
 *                   - To be upgraded

 */



contract MindplexUpgradeableToken is Initializable,AccessControlUpgradeable,ERC20Upgradeable,ERC20VotesUpgradeable,PausableUpgradeable{


    // Role that has the access to pause and unpause this contract
     bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    // Role that has the access to mint tokens on this contract 
     bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
     //Max supply of the token
     uint256 public constant MAX_SUPPLY = 1000000000*10**uint(6);

    
     /**
     *@dev Initializes name and symbol of the token contract
     * Grants `DEFAULT_ADMIN_ROLE`, `PAUSER_ROLE` and `MINTER_ROLE` to the
     * account that deploys the contract.
     * Mints the `MAX_SUPPLY` of `MPX` Token on contract deployment.
     */

    function initialize(string memory name,string memory symbol) initializer public {
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __Pausable_init();
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);


        _mint(msg.sender, MAX_SUPPLY);
    }


    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply()+amount<=MAX_SUPPLY,"Token to be minted should not exceed Max supply"); 
        _mint(to, amount);
    }


    
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

     /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) external virtual {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
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


    function pause() public virtual onlyRole(PAUSER_ROLE) {
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


    function unpause() public virtual onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
    * @dev Returns the number of decimals `6` used to get its user representation.
    * See {ERC20-decimals}
    */

    function decimals() public pure virtual override returns (uint8) {
        return 6;
     }




    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Upgradeable,ERC20VotesUpgradeable)
    {
        super._burn(account, amount);
    }


    
    /**
     * @dev Creates `amount` of new tokens and assigns them to an address `to`.
     * See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - The caller must have the `MINTER_ROLE`.
     * - The total supply should not exceed MAX_SUPPLY 
     */

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._mint(to, amount);
    }


    /**
     *@dev Hook to be called after before token transfer
     * See {ERC20-_beforeTokenTransfer}.
    */

     function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }


    /**
     *@dev Hook to be called after every token transfer
     * See {ERC20-_afterTokenTransfer}.
    */

    function _afterTokenTransfer(address from,address to,uint256 amount) internal 
    virtual override(ERC20Upgradeable,ERC20VotesUpgradeable){
    super._afterTokenTransfer(from,to,amount);
    } 
    
    
   
}


