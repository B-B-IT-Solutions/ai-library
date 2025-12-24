import prisma from "@/data/db/prisma";
import { CartWithItems } from "@/data/types/db/cart";
import { ProductType } from "@/generated/prisma/enums";
import { CartCreateInput } from "@/generated/prisma/models";

type GetOrCreateCartParams = {
   userId?: string;
   sessionCartId?: string;
};

export const pGetOrCreateCart = async (
   params: GetOrCreateCartParams
): Promise<CartWithItems> => {
   const { userId, sessionCartId } = params;
   // If user is authenticated, get user cart
   if (userId) {
      let cart = await pGetCartByUserId(userId);
      if (!cart) {
         cart = await pCreateCart({
            user: {
               connect: {
                  id: userId,
               },
            },
         });
      }
      return cart;
   }

   if (!sessionCartId) {
      throw new Error("Cart cannot be created without userId or sessionId");
   }

   let cart = await pGetCartBySessionId(sessionCartId);
   if (!cart) {
      cart = await pCreateCart({ sessionCartId });
   }

   return cart;
};

export const pGetCartBySessionId = async (
   sessionCartId: string
): Promise<CartWithItems | null> => {
   return await prisma.cart.findUnique({
      where: { sessionCartId },
      include: {
         items: true,
      },
   });
};

export const pGetCartByUserId = async (
   userId: string
): Promise<CartWithItems | null> => {
   return await prisma.cart.findFirst({
      where: { userId },
      include: {
         items: true,
      },
   });
};

export const pCreateCart = async (
   data: CartCreateInput
): Promise<CartWithItems> => {
   return await prisma.cart.create({
      data,
      include: {
         items: true,
      },
   });
};

export type AddItemToCartParams = {
   cartId: string;
   productId: string;
   productName: string;
   productType: ProductType;
   productPrice: number;
};

export const pAddItemToCart = async (params: AddItemToCartParams) => {
   const { cartId, productId, productName, productType, productPrice } = params;

   const existingItem = await prisma.cartItem.findUnique({
      where: {
         cartId_productId: {
            cartId,
            productId,
         },
      },
   });

   if (!existingItem) {
      return await prisma.cartItem.create({
         data: {
            cartId,
            productId,
            productName,
            productType,
            productPrice,
            quantity: 1,
         },
      });
   }

   return existingItem;
};

export const pRemoveCartItem = async (itemId: string) => {
   return await prisma.cartItem.delete({
      where: { id: itemId },
   });
};

export const pClearCart = async (cartId: string) => {
   return await prisma.cartItem.deleteMany({
      where: { cartId },
   });
};

export const pMigrateSessionCartToUser = async (
   sessionCartId: string,
   userId: string
) => {
   const sessionCart = await prisma.cart.findUnique({
      where: { sessionCartId },
   });

   if (sessionCart) {
      await prisma.cart.deleteMany({
         where: { userId },
      });

      await prisma.cart.update({
         where: { id: sessionCart.id },
         data: {
            userId,
            sessionCartId: null,
         },
      });
   }
};
