import { CartCreateInput } from "@/generated/prisma/models";
import { prisma } from "../prisma";

export const pGetCartBySessionId = async (sessionCartId: string) => {
   return await prisma.cart.findUnique({
      where: { sessionCartId },
      include: {
         items: {
            include: {
               product: {
                  include: {
                     template: {
                        include: {
                           categories: true,
                        },
                     },
                     bundleItems: {
                        include: {
                           template: {
                              include: {
                                 categories: true,
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   });
};

export const pGetCartByUserId = async (userId: string) => {
   return await prisma.cart.findFirst({
      where: { userId },
      include: {
         items: {
            include: {
               product: {
                  include: {
                     template: {
                        include: {
                           categories: true,
                        },
                     },
                     bundleItems: {
                        include: {
                           template: {
                              include: {
                                 categories: true,
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      },
   });
};

export const pCreateCart = async (data: CartCreateInput) => {
   return await prisma.cart.create({
      data,
      include: {
         items: {
            include: {
               product: true,
            },
         },
      },
   });
};

export const pAddItemToCart = async (
   cartId: string,
   productId: string,
   quantity: number
) => {
   // Check if item already exists in cart
   const existingItem = await prisma.cartItem.findUnique({
      where: {
         cartId_productId: {
            cartId,
            productId,
         },
      },
   });

   if (existingItem) {
      // Update quantity
      return await prisma.cartItem.update({
         where: { id: existingItem.id },
         data: { quantity: existingItem.quantity + quantity },
      });
   } else {
      // Create new item
      return await prisma.cartItem.create({
         data: {
            cartId,
            productId,
            quantity,
         },
      });
   }
};

export const pRemoveCartItem = async (itemId: string) => {
   return await prisma.cartItem.delete({
      where: { id: itemId },
   });
};

export const pUpdateCartItemQuantity = async (
   itemId: string,
   quantity: number
) => {
   return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
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
   // Find session cart
   const sessionCart = await prisma.cart.findUnique({
      where: { sessionCartId },
   });

   if (!sessionCart) {
      return null;
   }

   // Delete any existing user cart
   await prisma.cart.deleteMany({
      where: { userId },
   });

   // Update session cart to be user's cart
   return await prisma.cart.update({
      where: { id: sessionCart.id },
      data: {
         userId,
         sessionCartId: null,
      },
   });
};
