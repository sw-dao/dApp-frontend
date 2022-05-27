// SPDX-License-Identifier: MIT

pragma solidity =0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Implementation of the ERC20 smart contract.
 */
contract ERC20Mock is ERC20 {
  constructor(
    address initialAccount,
    string memory _name,
    string memory _symbol,
    uint256 _initialBalance
  ) public ERC20(_name, _symbol) {
    _mint(initialAccount, _initialBalance);
  }
}
