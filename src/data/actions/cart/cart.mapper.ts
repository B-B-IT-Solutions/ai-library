import { map } from "es-toolkit/compat";

import { toDProduct } from "@/data/actions/product/product.mapper";
import { DCart, DCartItem } from "@/data/types/domain/cart";

type PrismaCart = {
   id: string;
   userId: string | null;
   sessionCartId: string | null;
   createdAt: Date;
   updatedAt: Date;
   items: any[];
};

type PrismaCartItem = {
   id: string;
   cartId: string;
   productId: string;
   quantity: number;
   createdAt: Date;
   updatedAt: Date;
   product: any;
};

export const toDCart = (cart: PrismaCart): DCart => {
   const items = map(cart.items, (item) => toDCartItem(item));
   const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

   return {
      id: cart.id,
      userId: cart.userId ?? undefined,
      sessionCartId: cart.sessionCartId ?? undefined,
      items,
      subtotal,
      total: subtotal,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
   };
};

export const toDCartItem = (item: PrismaCartItem): DCartItem => {
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
