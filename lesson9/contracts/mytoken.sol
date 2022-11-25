// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//access control
import "@openzeppelin/contracts/access/AccessControl.sol";
contract mytoken is ERC20 , AccessControl {
      constructor() ERC20("mytoken", "MTK") {
      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        //_mint(msg.sender, 1000000000000000000000000);
      }
function mint(address account, uint256 amount) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "ERC20: must have minter role to mint");
        super._mint(account, amount);
    } 

}
