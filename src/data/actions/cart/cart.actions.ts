"use server";

import { cookies } from "next/headers";

import { auth } from "@/auth";
import { formatError } from "@/data/actions/utils";
import {
   pAddItemToCart,
   pClearCart,
   pGetOrCreateCart,
   pRemoveCartItem,
} from "@/data/db/queries/cart";
import { AddItemToCartParams } from "@/data/db/queries/cart/cart";
import { pMigrateSessionCartToUser } from "@/data/db/queries/cart/cart";
import { DCart } from "@/data/types/domain/cart";
import { DProduct } from "@/data/types/domain/product";
import { ActionResult } from "@/data/types/utils";

import { toDCart } from "./cart.mapper";

export const getCart = async (): Promise<DCart> => {
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

      const cart = await pGetOrCreateCart({ userId, sessionCartId });
      return toDCart(cart);
   } catch (error) {
      throw error;
   }
};

export const addToCart = async (
   product: DProduct
): Promise<ActionResult<DCart>> => {
   try {
      const cart = await getCart();

      const params: AddItemToCartParams = {
         cartId: cart.id,
         productId: product.id,
         productName: product.name,
         productType: product.type,
         productPrice: product.price,
      };

      await pAddItemToCart(params);

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
};

export const removeFromCart = async (
   itemId: string
): Promise<ActionResult<DCart>> => {
   try {
      await pRemoveCartItem(itemId);

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
};

export const clearCart = async (): Promise<ActionResult<void>> => {
   try {
      const cart = await getCart();
      await pClearCart(cart.id);

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
};

export const migrateSessionCartToUser = async (
   sessionCartId: string,
   userId: string
) => {
   await pMigrateSessionCartToUser(sessionCartId, userId);
};
