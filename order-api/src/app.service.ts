import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private prisma: PrismaService, // <--- Inject Prisma
  ) {}

  async placeOrder(pizzaType: string) {
    // 1. Save to DB first (Status: PENDING)
    const order = await this.prisma.order.create({
      data: {
        type: pizzaType,
        status: 'PENDING',
      },
    });

    // 2. Push ONLY the ID to Redis
    // We stringify the object { id: 1, type: "pepperoni" }
    // Use RPUSH to enqueue (tail) so BLPOP remains FIFO (first-in, first-out)
    const payload = JSON.stringify({ id: order.id, type: order.type });
    await this.redis.rpush('pizza-queue', payload);

    return {
      message: 'Order placed 🍕',
      orderId: order.id,
      status: order.status,
    };
  }
}
