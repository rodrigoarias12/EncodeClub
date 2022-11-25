// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
//erc721
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyToken721 is ERC721  {
  constructor     (string memory name, string memory symbol) ERC721(name, symbol) {   

  }
  function mint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }
}
