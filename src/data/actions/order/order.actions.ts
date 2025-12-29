"use server";

import { validate as isValidUuid } from "uuid";

import { createLibraryEntries } from "@/data/actions/library";
import prisma from "@/data/db/prisma";
import { pClearCart, pGetCartByUserId } from "@/data/db/queries/cart";
import { OrderRepository } from "@/data/db/queries/order";
import { DOrder } from "@/data/types/domain/order";
import { ActionResult } from "@/data/types/utils";
import { requireUser } from "../auth-utils";
import { formatError } from "../utils";

import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";

export const getOrders = async (): Promise<DOrder[]> => {
   try {
      const user = await requireUser();
      const orderRepository = new OrderRepository(prisma);
      const orders = await orderRepository.pGetOrders(user.id);
      return toDOrdersWithItems(orders);
   } catch {
      return [];
   }
};

export const getOrder = async (orderId: string): Promise<DOrder | null> => {
   try {
      const user = await requireUser();

      if (!isValidUuid(orderId)) {
         return null;
      }
      const orderRepository = new OrderRepository(prisma);
      const order = await orderRepository.pGetOrder(orderId);
      if (!order || order.userId !== user.id) {
         return null;
      }
      return toDOrderWithItems(order);
   } catch {
      return null;
   }
};

export const completeOrder = async (orderId: string): Promise<ActionResult> => {
   try {
      const orderRepository = new OrderRepository(prisma);
      const order = await orderRepository.pGetOrderProducts(orderId);
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
         };
      }

      await createLibraryEntries(order);
      await orderRepository.pUpdateOrderStatus(order.id, "COMPLETED");

      const cart = await pGetCartByUserId(order.userId);
      if (cart) {
         await pClearCart(cart.id);
      }

      return {
         success: true,
         message: "Order completed successfully!",
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
      const orderRepository = new OrderRepository(prisma);
      const order = await orderRepository.pGetOrder(orderId);

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
      await orderRepository.pUpdateOrderWithStripeDetails(orderId, {
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
      const orderRepository = new OrderRepository(prisma);
      await orderRepository.pUpdateOrderStatus(orderId, "FAILED");
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
      const orderRepository = new OrderRepository(prisma);
      const order = await orderRepository.pGetOrderByPaymentIntentId(
         paymentIntentId
      );

      if (!order) {
         return {
            success: false,
            message: `Order not found for payment intent ${paymentIntentId}`,
         };
      }

      await orderRepository.pUpdateOrderStatus(order.id, "FAILED");
      await orderRepository.pUpdateOrderWithStripeDetails(order.id, {
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
