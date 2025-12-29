"use server";

import prisma from "@/data/db/prisma";
import { CartRepository } from "@/data/db/queries/cart";
import { LibraryRepository } from "@/data/db/queries/library";
import { OrderRepository } from "@/data/db/queries/order";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { OrderService } from "@/data/services/order";
import { DbClient } from "@/data/types/db/common";
import { DOrder } from "@/data/types/domain/order";
import { ActionResult } from "@/data/types/utils";
import { formatError } from "../utils";

export const getOrders = async (): Promise<DOrder[]> => {
   const orderService = getOrderSevice();
   return orderService.getOrders();
};

export const getOrder = async (orderId: string): Promise<DOrder | null> => {
   const orderService = getOrderSevice();
   return orderService.getOrder(orderId);
};

export const handleStripeCheckoutCompleted = async (
   orderId: string,
   paymentIntentId: string,
   paymentStatus: string
): Promise<ActionResult> => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getOrderSevice(tx);
         return service.handleStripeCheckoutCompleted(
            orderId,
            paymentIntentId,
            paymentStatus
         );
      });

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
): Promise<ActionResult> => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getOrderSevice(tx);
         return service.handleStripeCheckoutExpired(orderId);
      });

      return {
         success: true,
         message: `Order ${orderId} flagged as FAILED due to expired session`,
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
): Promise<ActionResult> => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getOrderSevice(tx);
         return service.handleStripePaymentFailed(paymentIntentId);
      });

      return {
         success: true,
         message: `Order with paymentIntentId ${paymentIntentId} flagged as FAILED due to payment failure`,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

const getOrderSevice = (dbClient: DbClient = prisma) => {
   const orderRepository = new OrderRepository(dbClient);
   const cartRepository = new CartRepository(dbClient);
   const libraryRepository = new LibraryRepository(dbClient);
   const cartService = new CartService(cartRepository);
   const libraryService = new LibraryService(libraryRepository);
   return new OrderService(orderRepository, cartService, libraryService);
};
