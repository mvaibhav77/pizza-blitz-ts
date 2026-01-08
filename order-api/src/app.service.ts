import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async placeOrder(pizzaType: string) {
    // 1. Push to Queue (O(1) speed)
    await this.redis.lpush('pizza-queue', pizzaType);
    
    // 2. Get Queue Depth (for user feedback)
    const len = await this.redis.llen('pizza-queue');
    
    return {
      message: 'Order placed successfully 🍕',
      pizza: pizzaType,
      queueSize: len,
    };
  }
}