import { map } from "es-toolkit/compat";

import { OrderWithItems } from "@/data/types/db/order";
import { DOrder, DOrderItem, DOrderStatus } from "@/data/types/domain/order";
import { OrderItem } from "@/generated/prisma/client";

export const toDOrders = (orders: OrderWithItems[]): DOrder[] => {
   return map(orders, (o) => toDOrder(o));
};

export const toDOrder = (order: OrderWithItems): DOrder => {
   return {
      id: order.id,
      userId: order.userId,
      status: order.status as DOrderStatus,
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      stripeCheckoutSessionId: order.stripeCheckoutSessionId,
      stripePaymentIntentId: order.stripePaymentIntentId,
      stripePaymentStatus: order.stripePaymentStatus,
      items: toDOrderItems(order.items),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
   };
};

const toDOrderItems = (items: OrderItem[]): DOrderItem[] => {
   return map(items, (item) => toDOrderItem(item));
};

export const toDOrderItem = (item: OrderItem): DOrderItem => {
   return {
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productName: item.productName,
      productDescription: item.productDescription,
      productType: item.productType,
      price: Number(item.price),
      createdAt: item.createdAt.toISOString(),
   };
};
