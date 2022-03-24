// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FToken is ERC20 {
    constructor() ERC20("FToken", "FT") {
        _mint(msg.sender, 1000000000 * 10**18);
    }
}
