import { Controller, Get , Param, Query,Body, Post} from '@nestjs/common';
import { query } from 'express';
import { AppService } from './app.service';
export class CreatePaymentOrderDTO {
  readonly owner: string;
  readonly spender: string;
  readonly value: number;
}
export class ClaimPaymentOrderDTO {
  readonly id: number;
  readonly secrect: string;
  readonly address: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get("lastblock")
  getLastBlock(): any
  {
    return this.appService.getLastBlock();
  }
  @Get("block/:hash")
  getBlockByNumber(hash: number): any
  {
    return this.appService.getBlockByNumber(hash);
  }
  @Get("totalSupply/:address")
  getTotalSuply(@Param("address") address: string): any
  {
    return this.appService.getTotalSuply(address);
  }
  @Get("allowance")
  getAllowance(@Query("owner") owner: string, 
  @Query("spender") spender: string,
   @Query("address") address: string): any
  {
    return this.appService.getAllowance(owner, spender, address);
  }
  @Get("get payments Orders/:id")
  getPaymentsOrders(@Param("id") id: number): any
  {
    return this.appService.getPaymentsOrders(id);
  }
  @Post("create payments Orders")
  createPaymentsOrders(@Body() createPaymentOrderDTO: CreatePaymentOrderDTO): any
  {
    return this.appService.createPaymentsOrders(createPaymentOrderDTO.value , createPaymentOrderDTO.secrect);
  }
  @Post("claim payments Orders")
  clainPaymentsOrders(@Body() claimPaymentOrderDTO: ClaimPaymentOrderDTO): any
  {
    return this.appService.clainPaymentsOrders(claimPaymentOrderDTO.id, claimPaymentOrderDTO.secrect, claimPaymentOrderDTO.address);
  }

  
}
