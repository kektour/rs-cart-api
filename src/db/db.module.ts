import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: ['dist/db/entities/*.entity{.ts,.js}'],
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
      // synchronize: true,
    }),
    TypeOrmModule.forFeature([Cart, CartItem, Order]),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
