import { cookies } from "next/headers";

import { auth } from "@/auth";
import { CartRepository } from "@/data/repositories/cart";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";

import { toDCart } from "./cart.mapper";

export class CartService {
   private cartRepository: CartRepository;

   constructor(cartRepository: CartRepository) {
      this.cartRepository = cartRepository;
   }

   async getCart(): Promise<DCart> {
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
   }

   async addToCart(product: DProduct) {
      const cart = await this.getCart();
      await this.cartRepository.pAddItemToCart(cart.id, product);
   }

   async removeFromCart(itemId: string) {
      await this.cartRepository.pRemoveCartItem(itemId);
   }

   async clearCart(userId: string) {
      const cart = await this.cartRepository.pGetCartByUserId(userId);
      if (cart) {
         await this.cartRepository.pClearCart(cart.id);
      }
   }

   async deleteCarts(userId: string) {
      await this.cartRepository.pDeleteCarts(userId);
   }

   async migrateSessionCartToUser(sessionCartId: string, userId: string) {
      await this.cartRepository.pMigrateSessionCartToUser(
         sessionCartId,
         userId
      );
   }
}
