"use server";

import { validate as isValidUuid } from "uuid";

import { pClearCart, pGetCartByUserId } from "@/data/db/queries/cart";
import { pCreatePurchases } from "@/data/db/queries/library";
import {
   pGetOrderById,
   pGetOrderByPaymentIntentId,
   pGetOrders,
   pUpdateOrderStatus,
   pUpdateOrderWithStripeDetails,
} from "@/data/db/queries/order";
import { DOrder } from "@/data/types/domain/order";
import { ActionResult } from "@/data/types/utils";
import { requireUser } from "../auth-utils";
import { formatError } from "../utils";

import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";

export const getOrders = async (): Promise<DOrder[]> => {
   try {
      const user = await requireUser();
      const orders = await pGetOrders(user.id);
      return toDOrdersWithItems(orders);
   } catch {
      return [];
   }
};

export const getOrderById = async (orderId: string): Promise<DOrder | null> => {
   try {
      const user = await requireUser();

      if (!isValidUuid(orderId)) {
         return null;
      }

      const order = await pGetOrderById(orderId);
      if (!order || order.userId !== user.id) {
         return null;
      }
      return toDOrderWithItems(order);
   } catch {
      return null;
   }
};

export const completeOrder = async (
   orderId: string
): Promise<ActionResult<DOrder>> => {
   try {
      const order = await pGetOrderById(orderId);
      if (!order) {
         return {
            success: false,
            message: "Order not found.",
         };
      }

      if (order.status === "COMPLETED") {
         return {
            success: true,
            message: "Order already completed.",
            data: toDOrderWithItems(order),
         };
      }

      // Get cart to clear
      const cart = await pGetCartByUserId(order.userId);

      // Create purchases based on order items
      const templateIds: string[] = [];

      for (const item of order.items) {
         const product = item.product;

         if (product.type === "TEMPLATE" && product.templateId) {
            templateIds.push(product.templateId);
         } else if (product.type === "BUNDLE") {
            const bundleTemplateIds =
               product.bundleItems
                  ?.map((bi: any) => bi.templateId)
                  .filter(Boolean) || [];
            templateIds.push(...bundleTemplateIds);
         }
      }

      // Create purchase records
      if (templateIds.length > 0) {
         await pCreatePurchases(order.id, order.userId, templateIds);
      }

      // Update order status
      await pUpdateOrderStatus(order.id, "COMPLETED");

      // Clear cart
      if (cart) {
         await pClearCart(cart.id);
      }

      // Fetch updated order
      const completedOrder = await pGetOrderById(order.id);

      return {
         success: true,
         message: "Order completed successfully!",
         data: toDOrderWithItems(completedOrder!),
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const handleStripeCheckoutCompleted = async (
   orderId: string,
   paymentIntentId: string,
   paymentStatus: string
): Promise<ActionResult<void>> => {
   try {
      // Get order to check status
      const order = await pGetOrderById(orderId);

      if (!order) {
         return {
            success: false,
            message: `Order ${orderId} not found`,
         };
      }

      if (order.status === "COMPLETED") {
         return {
            success: true,
            message: `Order ${orderId} already completed`,
         };
      }

      // Update with Stripe payment details
      await pUpdateOrderWithStripeDetails(orderId, {
         stripePaymentIntentId: paymentIntentId,
         stripePaymentStatus: paymentStatus,
         paymentMethod: "STRIPE",
      });

      // Complete the order (creates purchases, clears cart)
      const result = await completeOrder(orderId);

      if (!result.success) {
         return {
            success: false,
            message: `Failed to complete order ${orderId}: ${result.message}`,
         };
      }

      return {
         success: true,
         message: `Order ${orderId} completed successfully`,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const handleStripeCheckoutExpired = async (
   orderId: string
): Promise<ActionResult<void>> => {
   try {
      await pUpdateOrderStatus(orderId, "FAILED");
      return {
         success: true,
         message: `Order ${orderId} marked as FAILED due to expired session`,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const handleStripePaymentFailed = async (
   paymentIntentId: string
): Promise<ActionResult<void>> => {
   try {
      const order = await pGetOrderByPaymentIntentId(paymentIntentId);

      if (!order) {
         return {
            success: false,
            message: `Order not found for payment intent ${paymentIntentId}`,
         };
      }

      await pUpdateOrderStatus(order.id, "FAILED");
      await pUpdateOrderWithStripeDetails(order.id, {
         stripePaymentStatus: "failed",
      });

      return {
         success: true,
         message: `Order ${order.id} marked as FAILED due to payment failure`,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};
