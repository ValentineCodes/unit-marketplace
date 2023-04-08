// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAI is ERC20 {
  constructor() ERC20("DAI", "DAI") {
    _mint(msg.sender, 1_000_000 * 1e18);
  }

  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
