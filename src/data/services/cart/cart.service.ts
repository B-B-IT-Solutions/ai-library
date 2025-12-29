import { cookies } from "next/headers";

import { auth } from "@/auth";
import { formatError } from "@/data/actions/utils";
import { AddItemToCartParams, CartRepository } from "@/data/db/queries/cart";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";
import { ActionResult } from "@/data/types/utils";

import { toDCart } from "./cart.mapper";

export class CartService {
   private cartRepository: CartRepository;

   constructor(cartRepository: CartRepository) {
      this.cartRepository = cartRepository;
   }

   async getCart(): Promise<DCart> {
      try {
         let userId = undefined;
         let sessionCartId = undefined;

         const session = await auth();
         if (session?.user?.id) {
            userId = session.user.id;
         } else {
            const cookiesObject = await cookies();
            sessionCartId = cookiesObject.get("sessionCartId")?.value;
         }

         const cart = await this.cartRepository.pGetOrCreateCart({
            userId,
            sessionCartId,
         });
         return toDCart(cart);
      } catch (error) {
         throw error;
      }
   }

   async addToCart(product: DProduct): Promise<ActionResult> {
      try {
         const cart = await this.getCart();

         const params: AddItemToCartParams = {
            cartId: cart.id,
            productId: product.id,
            productName: product.name,
            productType: product.type,
            productPrice: product.price,
         };

         await this.cartRepository.pAddItemToCart(params);

         return {
            success: true,
            message: "Item added to cart successfully.",
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }

   async removeFromCart(itemId: string): Promise<ActionResult> {
      try {
         await this.cartRepository.pRemoveCartItem(itemId);

         return {
            success: true,
            message: "Item removed from cart successfully.",
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }

   async clearCart(userId: string): Promise<ActionResult> {
      try {
         const cart = await this.cartRepository.pGetCartByUserId(userId);
         if (cart) {
            await this.cartRepository.pClearCart(cart.id);
         }

         return {
            success: true,
            message: "Cart cleared successfully.",
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }

   async migrateSessionCartToUser(sessionCartId: string, userId: string) {
      await this.cartRepository.pMigrateSessionCartToUser(
         sessionCartId,
         userId
      );
   }
}
