import { map } from "es-toolkit/compat";

import { toDProductWithItems } from "@/data/actions/product/product.mapper";
import { DOrder, DOrderItem, DOrderStatus } from "@/data/types/domain/order";

type PrismaOrder = {
   id: string;
   userId: string;
   status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
   totalAmount: any;
   paymentMethod: string | null;
   stripeCheckoutSessionId: string | null;
   stripePaymentIntentId: string | null;
   stripePaymentStatus: string | null;
   createdAt: Date;
   updatedAt: Date;
   items: any[];
};

type PrismaOrderItem = {
   id: string;
   orderId: string;
   productId: string;
   quantity: number;
   price: any;
   createdAt: Date;
   product: any;
};

export const toDOrders = (orders: PrismaOrder[]): DOrder[] => {
   return map(orders, (o) => toDOrder(o));
};

export const toDOrder = (order: PrismaOrder): DOrder => {
   return {
      id: order.id,
      userId: order.userId,
      status: order.status as DOrderStatus,
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod ?? undefined,
      stripeCheckoutSessionId: order.stripeCheckoutSessionId ?? undefined,
      stripePaymentIntentId: order.stripePaymentIntentId ?? undefined,
      stripePaymentStatus: order.stripePaymentStatus ?? undefined,
      items: map(order.items, (item) => toDOrderItem(item)),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
   };
};

export const toDOrderItem = (item: PrismaOrderItem): DOrderItem => {
   return {
      id: item.id,
      orderId: item.orderId,
      product: toDProductWithItems(item.product),
      quantity: item.quantity,
      price: Number(item.price),
      createdAt: item.createdAt.toISOString(),
   };
};
