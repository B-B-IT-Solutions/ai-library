"use server";

import { validate as isValidUuid } from "uuid";

import { auth } from "@/auth";
import {
   pClearCart,
   pGetCartBySessionId,
   pGetCartByUserId,
} from "@/data/db/queries/cart";
import {
   pCreateOrder,
   pCreatePurchases,
   pGetOrderById,
   pGetUserOrders,
   pUpdateOrderStatus,
} from "@/data/db/queries/order";
import { DOrder } from "@/data/types/domain/order";
import { ActionResult } from "@/data/types/utils";
import { formatError } from "../utils";

import { toDOrder, toDOrders } from "./order.mapper";

export const createOrder = async (
   paymentMethodId?: string
): Promise<ActionResult<DOrder>> => {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return {
            success: false,
            message: "You must be logged in to place an order.",
         };
      }

      const userId = session.user.id;

      // Get user's cart
      const cart = await pGetCartByUserId(userId);
      if (!cart || cart.items.length === 0) {
         return {
            success: false,
            message: "Your cart is empty.",
         };
      }

      // Calculate total
      const totalAmount = cart.items.reduce((sum, item) => {
         const price = Number(item.product.price);
         return sum + price * item.quantity;
      }, 0);

      // Create order
      const order = await pCreateOrder({
         user: { connect: { id: userId } },
         status: "PENDING",
         totalAmount,
         paymentMethod: paymentMethodId,
         items: {
            create: cart.items.map((item) => ({
               product: { connect: { id: item.productId } },
               quantity: item.quantity,
               price: Number(item.product.price),
            })),
         },
      });

      // Create purchases based on products
      const templateIds: string[] = [];

      for (const item of cart.items) {
         const product = item.product;

         if (product.type === "TEMPLATE" && product.templateId) {
            // Add template to purchases
            templateIds.push(product.templateId);
         } else if (product.type === "BUNDLE") {
            // Add all templates in bundle to purchases
            const bundleTemplateIds =
               product.bundleItems
                  ?.map((bi: any) => bi.templateId)
                  .filter(Boolean) || [];
            templateIds.push(...bundleTemplateIds);
         }
      }

      // Create purchase records
      if (templateIds.length > 0) {
         await pCreatePurchases(order.id, userId, templateIds);
      }

      // Update order status to completed
      await pUpdateOrderStatus(order.id, "COMPLETED");

      // Clear cart
      await pClearCart(cart.id);

      // Fetch updated order
      const completedOrder = await pGetOrderById(order.id);

      return {
         success: true,
         message: "Order placed successfully!",
         data: toDOrder(completedOrder!),
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const getOrderById = async (
   orderId: string
): Promise<DOrder | undefined> => {
   if (!isValidUuid(orderId)) {
      return undefined;
   }

   const session = await auth();
   if (!session?.user?.id) {
      return undefined;
   }

   const order = await pGetOrderById(orderId);
   if (!order || order.userId !== session.user.id) {
      return undefined;
   }

   return toDOrder(order);
};

export const getUserOrders = async (): Promise<DOrder[]> => {
   const session = await auth();
   if (!session?.user?.id) {
      return [];
   }

   const orders = await pGetUserOrders(session.user.id);
   return toDOrders(orders);
};
