// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
interface IMyToken {
    function mint(address account, uint256 amount) external;
    function burnfront(address account, uint256 amount) external;
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
   }
interface IMyERC721 {
    function safeMint(address to, uint256 tokenId) external;
    function burn(uint256 tokenId) external;

   
   }

contract TokenSale{
    uint256 public ratio;
    uint256 public Price;
    uint256 public ownerPool;
    uint256 public publicPool;
    IMyToken public paymentToken;
    IMyERC721 public Token721;

    constructor(uint256 _ratio, address _paymentToken, address _erc721, uint256 _price ){
     ratio = _ratio;
     paymentToken= IMyToken(_paymentToken);
     Token721= IMyERC721(_erc721);
     Price = _price;

    }

    function purchaseTokens() external payable {
        uint256 amountToBeMint = msg.value / ratio;
       paymentToken.mint(msg.sender, amountToBeMint);

    }

    function burnToken (uint256 amount) external {
        paymentToken.burnfront(msg.sender, amount);
       payable(msg.sender).transfer(amount  * ratio);
    }
   function purchaseNFT (uint256 tokenId) external  {
  
    uint256 ownercharge = Price /2;
    ownerPool +=ownercharge;
    publicPool += Price-ownercharge;
    paymentToken.transferFrom(msg.sender, address(this), Price);
    Token721.safeMint(msg.sender, tokenId);
    }   
    function withdraw(uint256 amount) external  {
        require(amount <= ownerPool, "Not enough funds");
        payable(msg.sender).transfer(amount);
        ownerPool -= amount;
    }
    function burnNFT(uint tokenId ) external {
        Token721.burn(tokenId);
        uint256 halfOfSalesValue = Price /2;
        paymentToken.transferFrom(address(this),msg.sender, halfOfSalesValue);
        publicPool -= halfOfSalesValue;
    }

}