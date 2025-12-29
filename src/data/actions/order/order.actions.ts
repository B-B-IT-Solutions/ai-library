"use server";

import prisma from "@/data/db/prisma";
import { CartRepository } from "@/data/db/queries/cart";
import { OrderRepository } from "@/data/db/queries/order";
import { CartService } from "@/data/services/cart";
import { OrderService } from "@/data/services/order";
import { DbClient } from "@/data/types/db/common";
import { DOrder } from "@/data/types/domain/order";
import { ActionResult } from "@/data/types/utils";

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
): Promise<ActionResult<void>> => {
   return prisma.$transaction(async (tx) => {
      const service = getOrderSevice(tx);
      return service.handleStripeCheckoutCompleted(
         orderId,
         paymentIntentId,
         paymentStatus
      );
   });
};

export const handleStripeCheckoutExpired = async (
   orderId: string
): Promise<ActionResult<void>> => {
   return prisma.$transaction(async (tx) => {
      const service = getOrderSevice(tx);
      return service.handleStripeCheckoutExpired(orderId);
   });
};

export const handleStripePaymentFailed = async (
   paymentIntentId: string
): Promise<ActionResult<void>> => {
   return prisma.$transaction(async (tx) => {
      const service = getOrderSevice(tx);
      return service.handleStripeCheckoutExpired(paymentIntentId);
   });
};

const getOrderSevice = (dbClient: DbClient = prisma) => {
   const orderRepository = new OrderRepository(dbClient);
   const cartRepository = new CartRepository(dbClient);
   const cartService = new CartService(cartRepository);
   return new OrderService(orderRepository, cartService);
};
