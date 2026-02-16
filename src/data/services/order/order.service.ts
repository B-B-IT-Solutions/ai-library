import { OrderRepository } from "@/data/repositories/order";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { DOrder, DOrderCreate, DOrderUpdate } from "@/data/types/domain/order";

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

   async getOrders(userId: string): Promise<DOrder[]> {
      return await this.orderRepository.pGetOrders(userId);
   }

   async getOrder(orderId: string, userId: string): Promise<DOrder | null> {
      return await this.orderRepository.pGetOrder(orderId, userId);
   }

   async createOrder(userId: string, oCreate: DOrderCreate): Promise<DOrder> {
      return this.orderRepository.pCreateOrder(oCreate, userId);
   }

   async updateOrder(orderId: string, dUpdate: DOrderUpdate) {
      await this.orderRepository.pUpdateOrder(orderId, dUpdate);
   }

   async deleteOrders(userId: string) {
      await this.orderRepository.pDeleteOrders(userId);
   }

   async handlePaymentCheckoutCompleted(
      orderId: string,
      paymentIntentId: string,
      paymentStatus: string
   ) {
      const order = await this.orderRepository.pGetOrderProducts(orderId);
      if (!order) {
         throw new Error(`Order ${orderId} not found`);
      }

      if (order.status !== "COMPLETED") {
         const payload: DOrderUpdate = {
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
      const payload: DOrderUpdate = {
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

      const orderUpdate: DOrderUpdate = {
         status: "FAILED",
         stripePaymentStatus: "failed",
      };
      await this.orderRepository.pUpdateOrder(order.id, orderUpdate);
   }
}
