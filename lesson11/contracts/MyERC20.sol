// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//access control
import "@openzeppelin/contracts/access/AccessControl.sol";
//burnable
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
contract MyToken  is ERC20 , AccessControl, ERC20Burnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
      constructor() ERC20("mytoken", "MTK") {
      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _grantRole(MINTER_ROLE, msg.sender);
      }
function mint(address account, uint256 amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "ERC20: must have minter role to mint");
        super._mint(account, amount);
    } 

}
