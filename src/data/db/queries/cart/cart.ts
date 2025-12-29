import { CartWithItems } from "@/data/types/db/cart";
import { PrismaClient } from "@/generated/prisma/client";
import { ProductType } from "@/generated/prisma/enums";
import { CartCreateInput } from "@/generated/prisma/models";

export type GetOrCreateCartParams = {
   userId?: string;
   sessionCartId?: string;
};

export type AddItemToCartParams = {
   cartId: string;
   productId: string;
   productName: string;
   productType: ProductType;
   productPrice: number;
};

export class CartRepository {
   private prisma: PrismaClient;

   constructor(prisma: PrismaClient) {
      this.prisma = prisma;
   }

   async pGetOrCreateCart(
      params: GetOrCreateCartParams
   ): Promise<CartWithItems> {
      const { userId, sessionCartId } = params;
      // If user is authenticated, get user cart
      if (userId) {
         let cart = await this.pGetCartByUserId(userId);
         if (!cart) {
            cart = await this.pCreateCart({
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

      let cart = await this.pGetCartBySessionId(sessionCartId);
      if (!cart) {
         cart = await this.pCreateCart({ sessionCartId });
      }

      return cart;
   }

   async pGetCartBySessionId(
      sessionCartId: string
   ): Promise<CartWithItems | null> {
      return await this.prisma.cart.findUnique({
         where: { sessionCartId },
         include: {
            items: true,
         },
      });
   }

   async pGetCartByUserId(userId: string): Promise<CartWithItems | null> {
      return await this.prisma.cart.findFirst({
         where: { userId },
         include: {
            items: true,
         },
      });
   }

   async pCreateCart(data: CartCreateInput): Promise<CartWithItems> {
      return await this.prisma.cart.create({
         data,
         include: {
            items: true,
         },
      });
   }

   async pAddItemToCart(params: AddItemToCartParams) {
      const { cartId, productId, productName, productType, productPrice } =
         params;

      const existingItem = await this.prisma.cartItem.findUnique({
         where: {
            cartId_productId: {
               cartId,
               productId,
            },
         },
      });

      if (!existingItem) {
         return await this.prisma.cartItem.create({
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
   }

   async pRemoveCartItem(itemId: string) {
      return await this.prisma.cartItem.delete({
         where: { id: itemId },
      });
   }

   async pClearCart(cartId: string) {
      return await this.prisma.cartItem.deleteMany({
         where: { cartId },
      });
   }

   async pMigrateSessionCartToUser(sessionCartId: string, userId: string) {
      const sessionCart = await this.prisma.cart.findUnique({
         where: { sessionCartId },
      });

      if (sessionCart) {
         await this.prisma.cart.deleteMany({
            where: { userId },
         });

         await this.prisma.cart.update({
            where: { id: sessionCart.id },
            data: {
               userId,
               sessionCartId: null,
            },
         });
      }
   }
}
