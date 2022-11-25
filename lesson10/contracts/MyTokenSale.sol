// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
interface MyToken {
    function mint(address account, uint256 amount) external;
   }

contract TokenSale{
    uint256 public ratio;
    address public paymentToken;

    constructor(uint256 _ratio, address _paymentToken ){
     ratio = _ratio;
     paymentToken= _paymentToken;
    }

    function purchaseTokens() external payable {
        uint256 amountToBeMint = msg.value / ratio;
        MyToken(paymentToken).mint(msg.sender, amountToBeMint);
    }

   
}