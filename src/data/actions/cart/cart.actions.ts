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
import { DCart } from "@/data/types/domain/cart";
import { ActionResult } from "@/data/types/utils";
import { addToCartSchema } from "@/data/types/validators/product.schema";

import { toDCart } from "./cart.mapper";

export const getCart = async (): Promise<DCart | null> => {
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
   } catch {
      return null;
   }
};

export const addToCart = async (
   productId: string,
   quantity: number = 1
): Promise<ActionResult<DCart>> => {
   try {
      const validated = addToCartSchema.parse({ productId, quantity });
      const cart = await getCart();

      // Check if item already exists
      const existingItem = cart.items?.find(
         (item: any) => item.productId === validated.productId
      );

      await pAddItemToCart(cart.id, validated.productId, validated.quantity);

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
