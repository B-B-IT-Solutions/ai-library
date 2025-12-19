import { map } from "es-toolkit/compat";

import { toDProduct } from "@/data/actions/product/product.mapper";
import { CartWithItems } from "@/data/types/db/cart";
import { DCart, DCartItem } from "@/data/types/domain/cart";
import { CartItem } from "@/generated/prisma/client";

export const toDCart = (cart: CartWithItems): DCart => {
   const items = map(cart.items, (item) => toDCartItem(item));
   const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

   return {
      id: cart.id,
      userId: cart.userId,
      sessionCartId: cart.sessionCartId,
      items,
      subtotal,
      total: subtotal,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
   };
};

export const toDCartItem = (item: CartItem): DCartItem => {
   const product = toDProduct(item.product);
   const lineTotal = product.price * item.quantity;

   return {
      id: item.id,
      cartId: item.cartId,
      product,
      quantity: item.quantity,
      lineTotal,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
   };
};
