import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('order') // 👈 Base route: /order
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':type') // 👈 Path: /order/:type
  async orderPizza(@Param('type') type: string) {
    console.log(`🔔 Incoming order: ${type}`);
    return this.appService.placeOrder(type);
  }
}
