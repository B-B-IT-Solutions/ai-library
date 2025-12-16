"use server";

import { cookies } from "next/headers";

import { auth } from "@/auth";
import {
   pAddItemToCart,
   pClearCart,
   pCreateCart,
   pGetCartBySessionId,
   pGetCartByUserId,
   pRemoveCartItem,
} from "@/data/db/queries/cart";
import { DCart, DCartSummary } from "@/data/types/domain/cart";
import { ActionResult } from "@/data/types/utils";
import { addToCartSchema } from "@/data/types/validators/product.schema";
import { formatError } from "../utils";

import { toDCart } from "./cart.mapper";

const getOrCreateCart = async (): Promise<any> => {
   const session = await auth();
   const userId = session?.user?.id;

   // If user is authenticated, get user cart
   if (userId) {
      let cart = await pGetCartByUserId(userId);
      if (!cart) {
         cart = await pCreateCart({ user: { connect: { id: userId } } });
      }
      return cart;
   }

   // If not authenticated, use session cart
   const cookiesObject = await cookies();
   const sessionCartId = cookiesObject.get("sessionCartId")?.value;

   if (!sessionCartId) {
      throw new Error("Session cart ID not found");
   }

   let cart = await pGetCartBySessionId(sessionCartId);
   if (!cart) {
      cart = await pCreateCart({ sessionCartId });
   }

   return cart;
};

export const getCartSummary = async (): Promise<DCart> => {
   try {
      const cart = await getOrCreateCart();
      return toDCart(cart);
   } catch (error) {
      // Return empty cart if error
      return {
         id: "",
         items: [],
         subtotal: 0,
         total: 0,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
      };
   }
};

export const addToCart = async (
   productId: string,
   quantity: number = 1
): Promise<ActionResult<DCart>> => {
   try {
      const validated = addToCartSchema.parse({ productId, quantity });
      const cart = await getOrCreateCart();

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

      const cart = await getOrCreateCart();
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
      const cart = await getOrCreateCart();
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
