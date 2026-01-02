import { map } from "es-toolkit/compat";

import { OrderWithItems } from "@/data/types/db/order";
import { DOrder, DOrderItem, DOrderStatus } from "@/data/types/domain/order";
import { Order, OrderItem } from "@/generated/prisma/client";

export const toDOrdersWithItems = (orders: OrderWithItems[]): DOrder[] => {
   return map(orders, (o) => toDOrderWithItems(o));
};

export const toDOrderWithItems = (order: OrderWithItems): DOrder => {
   return {
      ...toDOrder(order),
      items: toDOrderItems(order.items),
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
      price: Number(item.price.toFixed(2)),
      createdAt: item.createdAt.toISOString(),
   };
};

export const toDOrder = (order: Order): DOrder => {
   return {
      id: order.id,
      userId: order.userId,
      status: order.status as DOrderStatus,
      totalAmount: Number(order.totalAmount.toFixed(2)),
      paymentMethod: order.paymentMethod,
      stripeCheckoutSessionId: order.stripeCheckoutSessionId,
      stripePaymentIntentId: order.stripePaymentIntentId,
      stripePaymentStatus: order.stripePaymentStatus,
      items: [],
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
   };
};
