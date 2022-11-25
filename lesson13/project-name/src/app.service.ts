import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { throwError } from 'rxjs';
import * as tokenAbi from './assets/MyToken.json';


require("dotenv").config()
class PaymentOrderModel {
  value: number;
  secrect: string;
  id: number;
}

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  paymentsOrders: PaymentOrderModel[];
  constructor() {
    this.provider = ethers.getDefaultProvider("goerli");
    this.paymentsOrders = [];
  }
  getLastBlock(): any {
    return ethers.getDefaultProvider("goerli").getBlock("latest");
  }
  getBlockByNumber(blockNumber: number): any {
    return ethers.getDefaultProvider("goerli").getBlock(blockNumber);
  }
  getTotalSuply(address: string): any {
    const contract = new ethers.Contract(address, tokenAbi.abi, this.provider);
    const totalSupply = contract.totalSupply();
    return totalSupply;
  }
  getAllowance(owner: string, spender: string, address: string): any {
    const contract = new ethers.Contract(address, tokenAbi.abi, this.provider);
    const allowance = contract.allowance(owner, spender);
    return allowance;
  }
  getPaymentsOrders(id: number): any {
    return this.paymentsOrders[id];
  }
  createPaymentsOrders(value1: number, secrect: string): any {
    const newPaymentOrder = new PaymentOrderModel();
    newPaymentOrder.value = value1;
    newPaymentOrder.secrect = secrect;
    // newPaymentOrder.id = this.pamymentsOrders;
    this.paymentsOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }
  async clainPaymentsOrders(id: number, secrect: string, address: string): any {
   // if (secrect != this.paymentsOrders[id], secrect)
     // throw new HttpException("secrect is not correct", 403);
    const seed = process.env.mnemonic;
    const wallet = ethers.Wallet.fromMnemonic(seed);
    const signer = wallet.connect(this.provider);
    const contractInstance = new ethers.Contract(address, tokenAbi.abi, signer);
   // const transaction = contractInstance.transfer(this.paymentsOrders[id].value);
   const tx= await contractInstance.mint(address, ethers.utils.parseEther("10"));  
     return tx.wait();
  }
  async getTransaction(hash: string): Promise<any> {
    return this.provider.getTransaction(hash);
  }
  async getTransactionStatus(hash: string): Promise<any> {
    const transaction = await this.getTransaction(hash);
    return transaction.status;
  }
}
