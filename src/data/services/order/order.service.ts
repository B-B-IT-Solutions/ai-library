import { validate as isValidUuid } from "uuid";

import { OrderRepository } from "@/data/db/queries/order";
import { CartService } from "@/data/services/cart";
import { DOrder } from "@/data/types/domain/order";
import { requireUser } from "../../actions/auth-utils";
import { LibraryService } from "../library";

import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";

export class OrderService {
   private orderRepository: OrderRepository;
   private cartService: CartService;
   private libraryService: LibraryService;

   constructor(
      orderRepository: OrderRepository,
      cartService: CartService,
      libraryService: LibraryService
   ) {
      this.orderRepository = orderRepository;
      this.cartService = cartService;
      this.libraryService = libraryService;
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

   async handleStripeCheckoutCompleted(
      orderId: string,
      paymentIntentId: string,
      paymentStatus: string
   ) {
      const order = await this.orderRepository.pGetOrderProducts(orderId);
      if (!order) {
         throw new Error(`Order ${orderId} not found`);
      }

      if (order.status !== "COMPLETED") {
         await this.orderRepository.pUpdateOrder(orderId, {
            status: "COMPLETED",
            stripePaymentIntentId: paymentIntentId,
            stripePaymentStatus: paymentStatus,
            paymentMethod: "STRIPE",
         });
         await this.libraryService.createLibraryEntries(order);
         await this.cartService.clearCart(order.userId);
      }
   }

   async handleStripeCheckoutExpired(orderId: string) {
      await this.orderRepository.pUpdateOrder(orderId, {
         status: "FAILED",
      });
   }

   async handleStripePaymentFailed(paymentIntentId: string) {
      const order = await this.orderRepository.pGetOrderByPaymentIntentId(
         paymentIntentId
      );

      if (!order) {
         throw new Error(
            `Order with paymentIntentId ${paymentIntentId} not found`
         );
      }

      await this.orderRepository.pUpdateOrder(order.id, {
         status: "FAILED",
         stripePaymentStatus: "failed",
      });
   }
}
