import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from '../../db/entities/cart.entity';
import { CartItem } from '../../db/entities/cart-item.entity';
import { Status } from '../../types/cart';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly _cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private readonly _cartItemsRepo: Repository<CartItem>,
  ) {}

  // #region Old

  public findCartByUserId(userId: string): Promise<Cart | null> {
    return this._cartRepo.findOne({
      where: { userId, status: Status.OPEN },
      relations: ['items'],
    });
  }

  public async createCartByUserId(userId: string) {
    const currentDate = new Date();
    const currentDateAsISO = currentDate.toISOString();

    await this._cartRepo.insert({
      userId,
      status: Status.OPEN,
      createdAt: currentDateAsISO,
      updatedAt: currentDateAsISO,
    });

    return this.findCartByUserId(userId);
  }

  public async findOrCreateCartByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findCartByUserId(userId);

    if (!userCart) {
      return this.createCartByUserId(userId);
    }

    return userCart;
  }

  // #endregion

  // #region New

  public async updateOrCreateCartProductById(cartId: string, productId: string, count: number, productPrice: number): Promise<void> {
    try {
      const product = await this._cartItemsRepo.findOne({
        where: { cartId, productId },
      });

      if (!product) {
        await this._cartItemsRepo.insert({
          cartId,
          productId,
          count,
          price: productPrice,
        });
      } else {
        await this._cartItemsRepo.update({ cartId, productId }, { count });
      }
    } catch (e) {
      console.log('CartService.updateOrCreateCartProductById :>> ', e);

      throw e;
    }
  }

  public getAllCarts(): Promise<Array<Cart>> {
    return this._cartRepo.find({ relations: ['items'] });
  }

  public findCartById(id: string): Promise<Cart> {
    return this._cartRepo.findOne({ where: { id }, relations: ['items'] });
  }

  public async removeCartProduct(cartId: string, productId: string): Promise<void> {
    try {
      await this._cartItemsRepo.delete({ cartId, productId });
    } catch (e) {
      console.log('CartService.removeCartProduct :>> ', e);

      throw e;
    }
  }

  // #endregion
}
