import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { OrderService } from '../order';

import { Status } from '../types/cart';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @Get('/all')
  async getAllCarts() {
    const carts = await this.cartService.getAllCarts();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { carts },
    };
  }

  @Get(':userId')
  async findUserOpenedCart(@Param('userId') userId: string) {
    const cart = await this.cartService.findOrCreateCartByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart },
    };
  }

  @Put(':cartId')
  async updateCartProduct(@Param('cartId') cartId: string, @Body() body: Record<string, any>) {
    const { productId, count, productPrice } = body;

    const cart = await this.cartService.findCartById(cartId);

    if (cart.status === Status.ORDERED) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cart has been ordered',
      };
    }

    await this.cartService.updateOrCreateCartProductById(
      cartId,
      productId,
      count,
      productPrice,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { updated: true },
    };
  }

  @Delete(':cartId')
  async deleteCartProduct(@Param('cartId') cartId: string, @Body() body: Record<string, any>) {
    const { productId } = body;

    const cart = await this.cartService.findCartById(cartId);

    if (cart.status === Status.ORDERED) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cart has been ordered',
      };
    }

    await this.cartService.removeCartProduct(cartId, productId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { deleted: true },
    };
  }

  @Post('checkout/:cartId')
  async checkoutCart(@Param('cartId') cartId: string, @Body() body: Record<string, any>) {
    const { payment, delivery, comments, status } = body;
    const cart = await this.cartService.findCartById(cartId);

    if (!(cart && cart.items.length)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cart is empty',
      };
    }

    await this.orderService.create(
      cart.userId,
      cart.id,
      payment,
      delivery,
      comments,
      status,
      calculateCartTotal(cart),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { created: true },
    };
  }
}
