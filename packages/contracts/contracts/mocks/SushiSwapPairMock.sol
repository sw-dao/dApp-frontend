// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./UniswapV2ERC20.sol";

contract SushiSwapPairMock is UniswapV2ERC20 {
    constructor() public UniswapV2ERC20() {}
}