"use server";

import { cookies } from "next/headers";

import { auth } from "@/auth";
import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import {
   pAddItemToCart,
   pClearCart,
   pGetCartBySessionId,
   pGetCartByUserId,
   pGetOrCreateCart,
   pRemoveCartItem,
} from "@/data/db/queries/cart";
import { AddItemToCartParams } from "@/data/db/queries/cart/cart";
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

      // Check if item already exists
      const existingItem = cart.items?.find(
         (item: any) => item.productId === product.id
      );

      const params: AddItemToCartParams = {
         cartId: cart.id,
         productId: product.id,
         productName: product.name,
         productType: product.type,
         productPrice: product.price,
      };

      await pAddItemToCart(params);

      // Fetch updated cart
      const session = await auth();
      const userId = session?.user?.id;

      const updatedCart = userId
         ? await pGetCartByUserId(userId)
         : await pGetCartBySessionId(cart.sessionCartId!);

      return {
         success: true,
         message: existingItem
            ? "Item is already in your cart."
            : "Item added to cart successfully.",
         data: toDCart(updatedCart!),
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

      const cart = await getCart();
      const session = await auth();
      const userId = session?.user?.id;

      const updatedCart = userId
         ? await pGetCartByUserId(userId)
         : await pGetCartBySessionId(cart.sessionCartId!);

      return {
         success: true,
         message: "Item removed from cart successfully.",
         data: toDCart(updatedCart!),
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
      const user = await requireUser();
      const cart = await pGetCartByUserId(user.id);

      if (cart) {
         await pClearCart(cart.id);
         return {
            success: true,
            message: "Cart cleared successfully.",
         };
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
};
