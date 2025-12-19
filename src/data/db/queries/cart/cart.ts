import prisma from "@/data/db/prisma";
import { CartWithItems } from "@/data/types/db/cart";
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
         cart = await pCreateCart({ user: { connect: { id: userId } } });
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

export const pGetCartByUserId = async (
   userId: string
): Promise<CartWithItems | null> => {
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
      // For digital products, don't allow duplicates - just return existing item
      return existingItem;
   } else {
      // Create new item with quantity of 1 (digital products)
      return await prisma.cartItem.create({
         data: {
            cartId,
            productId,
            quantity: 1,
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
