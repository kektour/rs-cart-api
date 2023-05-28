import { Cart } from '../../db/entities/cart.entity';
import { CartItem } from '../../db/entities/cart-item.entity';

export function calculateCartTotal(cart: Cart): number {
  return cart
    ? cart.items.reduce((acc: number, { price, count }: CartItem) => {
        return (acc += price * count);
      }, 0)
    : 0;
}
