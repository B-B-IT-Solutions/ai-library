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
   pGetOrderByPaymentIntentId,
   pGetUserOrders,
   pUpdateOrderStatus,
   pUpdateOrderWithStripeDetails,
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

      // Order created as PENDING
      // Completion will happen after payment via webhook
      return {
         success: true,
         message: "Order created successfully!",
         data: toDOrder(order),
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
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
            data: toDOrder(order),
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

// Webhook handler actions
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

      // Idempotency check
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
      // Find order by payment intent ID
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
