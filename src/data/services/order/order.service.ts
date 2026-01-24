import { map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { OrderRepository, OrderUpdate } from "@/data/repositories/order";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { DCart } from "@/data/types/domain/cart";
import { DOrder, DOrderUpdate } from "@/data/types/domain/order";

import {
   toDOrder,
   toDOrdersWithItems,
   toDOrderWithItems,
} from "./order.mapper";

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

   async createOrder(userId: string, cart: DCart): Promise<DOrder> {
      const items = map(cart.items, (item) => ({
         product: {
            connect: {
               id: item.productId,
            },
         },
         productName: item.productName,
         productDescription: item.productDescription,
         productType: item.productType,
         quantity: item.quantity,
         price: Number(item.productPrice),
      }));

      const order = await this.orderRepository.pCreateOrder({
         user: {
            connect: {
               id: userId,
            },
         },
         status: "PENDING",
         totalAmount: cart.total,
         items: {
            create: items,
         },
      });

      return toDOrder(order);
   }

   async updateOrder(orderId: string, dUpdate: DOrderUpdate) {
      const update: OrderUpdate = {
         stripeCheckoutSessionId: dUpdate.stripeCheckoutSessionId,
         stripePaymentStatus: dUpdate.stripePaymentStatus,
      };
      await this.orderRepository.pUpdateOrder(orderId, update);
   }

   async deleteOrders(userId: string) {
      await this.orderRepository.pDeleteOrders(userId);
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
         const payload: OrderUpdate = {
            status: "COMPLETED",
            stripePaymentIntentId: paymentIntentId,
            stripePaymentStatus: paymentStatus,
            paymentMethod: "STRIPE",
         };
         await this.orderRepository.pUpdateOrder(orderId, payload);
         await this.libraryService.createLibraryEntries(order);
         await this.cartService.clearCart(order.userId);
      }
   }

   async handleStripeCheckoutExpired(orderId: string) {
      const payload: OrderUpdate = {
         status: "FAILED",
      };
      await this.orderRepository.pUpdateOrder(orderId, payload);
   }

   async handleStripePaymentFailed(paymentIntentId: string) {
      const order =
         await this.orderRepository.pGetOrderByPaymentIntentId(paymentIntentId);

      if (!order) {
         throw new Error(
            `Order with paymentIntentId ${paymentIntentId} not found`
         );
      }

      const payload: OrderUpdate = {
         status: "FAILED",
         stripePaymentStatus: "failed",
      };
      await this.orderRepository.pUpdateOrder(order.id, payload);
   }
}
