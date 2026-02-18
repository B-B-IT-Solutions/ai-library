import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { CartWithItems } from "@/data/types/db/cart";
import { DCart, DCartItem } from "@/data/types/domain/cart";
import { CartItem } from "@/generated/prisma/client";

import { toDCart, toDCartItem } from "./cart.mapper";
import { calculateSubTotalAmount } from "./utils";

const toDCartInternal = (cart: CartWithItems): DCart => {
   const subtotal = calculateSubTotalAmount(cart);
   const items = map(cart.items, (item) => toDCartItemInternal(item));

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

const toDCartItemInternal = (item: CartItem): DCartItem => {
   const lineTotal = Number(item.productPrice) * item.quantity;

   return {
      id: item.id,
      cartId: item.cartId,
      productId: item.productId,
      productName: item.productName,
      productType: item.productType,
      productPrice: Number(item.productPrice),
      quantity: item.quantity,
      lineTotal,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
   };
};

describe("toDCart tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDCart test", async () => {
      const cart = ptestData.pCartWithItems();
      const result = toDCart(cart);
      const expectedResult = toDCartInternal(cart);
      expect(result).toEqual(expectedResult);
   });

   it("toDCartItem test", async () => {
      const item = ptestData.pCartItem();
      const result = toDCartItem(item);
      const expectedResult = toDCartItemInternal(item);
      expect(result).toEqual(expectedResult);
   });
});
