import { validate as isValidUuid } from "uuid";

import { createLibraryEntries } from "@/data/actions/library";
import { CartRepository } from "@/data/db/queries/cart";
import { OrderRepository } from "@/data/db/queries/order";
import { DOrder } from "@/data/types/domain/order";
import { ActionResult } from "@/data/types/utils";
import { requireUser } from "../../actions/auth-utils";
import { formatError } from "../../actions/utils";

import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";

export class OrderService {
   private orderRepository: OrderRepository;
   private cartRepository: CartRepository;

   constructor(
      orderRepository: OrderRepository,
      cartRepository: CartRepository
   ) {
      this.orderRepository = orderRepository;
      this.cartRepository = cartRepository;
   }

   async getOrders(): Promise<DOrder[]> {
      try {
         const user = await requireUser();
         const orders = await this.orderRepository.pGetOrders(user.id);
         return toDOrdersWithItems(orders);
      } catch {
         return [];
      }
   }

   async getOrder(orderId: string): Promise<DOrder | null> {
      try {
         const user = await requireUser();

         if (!isValidUuid(orderId)) {
            return null;
         }
         const order = await this.orderRepository.pGetOrder(orderId);
         if (!order || order.userId !== user.id) {
            return null;
         }
         return toDOrderWithItems(order);
      } catch {
         return null;
      }
   }

   async completeOrder(orderId: string): Promise<ActionResult> {
      try {
         const order = await this.orderRepository.pGetOrderProducts(orderId);
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
         await this.orderRepository.pUpdateOrderStatus(order.id, "COMPLETED");

         const cart = await this.cartRepository.pGetCartByUserId(order.userId);
         if (cart) {
            await this.cartRepository.pClearCart(cart.id);
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
   }

   async handleStripeCheckoutCompleted(
      orderId: string,
      paymentIntentId: string,
      paymentStatus: string
   ): Promise<ActionResult<void>> {
      try {
         // Get order to check status
         const order = await this.orderRepository.pGetOrder(orderId);

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
         await this.orderRepository.pUpdateOrderWithStripeDetails(orderId, {
            stripePaymentIntentId: paymentIntentId,
            stripePaymentStatus: paymentStatus,
            paymentMethod: "STRIPE",
         });

         // Complete the order (creates purchases, clears cart)
         const result = await this.completeOrder(orderId);

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
   }

   async handleStripeCheckoutExpired(
      orderId: string
   ): Promise<ActionResult<void>> {
      try {
         await this.orderRepository.pUpdateOrderStatus(orderId, "FAILED");
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
   }

   async handleStripePaymentFailed(
      paymentIntentId: string
   ): Promise<ActionResult<void>> {
      try {
         const order = await this.orderRepository.pGetOrderByPaymentIntentId(
            paymentIntentId
         );

         if (!order) {
            return {
               success: false,
               message: `Order not found for payment intent ${paymentIntentId}`,
            };
         }

         await this.orderRepository.pUpdateOrderStatus(order.id, "FAILED");
         await this.orderRepository.pUpdateOrderWithStripeDetails(order.id, {
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
   }
}
