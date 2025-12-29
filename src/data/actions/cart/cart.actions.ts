"use server";

import prisma from "@/data/db/prisma";
import { CartRepository } from "@/data/db/queries/cart";
import { CartService } from "@/data/services/cart";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";
import { ActionResult } from "@/data/types/utils";

export const getCart = async (): Promise<DCart> => {
   const service = getCartSevice();
   return service.getCart();
};

export const addToCart = async (product: DProduct): Promise<ActionResult> => {
   const service = getCartSevice();
   return service.addToCart(product);
};

export const removeFromCart = async (itemId: string): Promise<ActionResult> => {
   const service = getCartSevice();
   return service.removeFromCart(itemId);
};

export const migrateSessionCartToUser = async (
   sessionCartId: string,
   userId: string
) => {
   const service = getCartSevice();
   service.migrateSessionCartToUser(sessionCartId, userId);
};

const getCartSevice = () => {
   const cartRepository = new CartRepository(prisma);
   return new CartService(cartRepository);
};
