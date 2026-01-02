"use server";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DOrder } from "@/data/types/domain/order";

export const getOrders = async (): Promise<DOrder[]> => {
   const orderService = getOrderSevice();
   return orderService.getOrders();
};

export const getOrder = async (orderId: string): Promise<DOrder | null> => {
   const orderService = getOrderSevice();
   return orderService.getOrder(orderId);
};

const getOrderSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getOrderService();
};
