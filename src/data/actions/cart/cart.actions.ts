"use server";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";
import { ActionResult } from "@/data/types/utils";

export const getCart = async (): Promise<DCart> => {
   const service = getCartSevice();
   return service.getCart();
};

export const addToCart = async (product: DProduct): Promise<ActionResult> => {
   try {
      const service = getCartSevice();
      await service.addToCart(product);
      return {
         success: true,
         message: "Item added to the cart successfully.",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Item couldn't be added to the cart.",
      };
   }
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

const getCartSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getCartService();
};
