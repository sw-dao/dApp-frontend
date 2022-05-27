// SPDX-License-Identifier: MIT

pragma solidity =0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "../libraries/ERC20Permit.sol";
/**
 * @dev Implementation of the SW DAO (SWD) ERC20 smart contract.
 */
contract SWDAO is ERC20Permit, ERC20Burnable {
  string public constant NAME = 'SW DAO';
  string public constant SYMBOL = 'SWD';
  string public constant VERSION = '1';
  uint256 public constant INITIAL_BALANCE = 991041 ether;

  constructor (address initialAccount) public ERC20Permit(NAME, SYMBOL, VERSION) {
    _mint(initialAccount, INITIAL_BALANCE);
  }
}