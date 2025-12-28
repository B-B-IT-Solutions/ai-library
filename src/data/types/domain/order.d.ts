import { DProduct } from "./product";

export type DOrderStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type DOrder = {
   id: string;
   userId: string;
   status: DOrderStatus;
   totalAmount: number;
   paymentMethod?: string;
   stripeCheckoutSessionId?: string;
   stripePaymentIntentId?: string;
   stripePaymentStatus?: string;
   items: DOrderItem[];
   createdAt: string;
   updatedAt: string;
};

export type DOrderItem = {
   id: string;
   orderId: string;
   product: DProduct;
   quantity: number;
   price: number;
   createdAt: string;
};
