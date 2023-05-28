import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { Status as CartServiceStatus } from '../../types/cart';
import { Cart } from '../../db/entities/cart.entity';
import { Order } from '../../db/entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectConnection() private readonly _connection: Connection) {}

  public async create(
    userId: string,
    cartId: string,
    payment: string,
    delivery: string,
    comments: string,
    status: string,
    total: number,
  ): Promise<void> {
    try {
      await this._connection.transaction(async entityManager => {
        const ordersRepo = entityManager.getRepository(Order);
        const cartsRepo = entityManager.getRepository(Cart);

        await Promise.all([
          ordersRepo.insert({
            userId,
            cartId,
            payment,
            delivery,
            comments,
            status,
            total,
          }),
          cartsRepo.update(
            { id: cartId },
            { status: CartServiceStatus.ORDERED },
          ),
        ]);
      });
    } catch (e) {
      console.log('OrderService.create :>> ', e);

      throw e;
    }
  }
}
