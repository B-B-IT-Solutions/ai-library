import { RepositoryFactory } from "@/data/db/queries/repository.factory";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { OrderService } from "@/data/services/order";
import { StripeService } from "@/data/services/stripe";
import { DbClient } from "@/data/types/db/common";

export class ServiceFactory {
   private repositories: RepositoryFactory;
   private cartService?: CartService;
   private libraryService?: LibraryService;
   private orderService?: OrderService;
   private stripeService?: StripeService;

   constructor(prisma: DbClient) {
      this.repositories = new RepositoryFactory(prisma);
   }

   getCartService(): CartService {
      if (!this.cartService) {
         this.cartService = new CartService(this.repositories.cartRepository());
      }
      return this.cartService;
   }

   getLibraryService(): LibraryService {
      if (!this.libraryService) {
         this.libraryService = new LibraryService(
            this.repositories.libraryRepository()
         );
      }
      return this.libraryService;
   }

   getOrderService(): OrderService {
      if (!this.orderService) {
         this.orderService = new OrderService(
            this.repositories.orderRepository(),
            this.getCartService(),
            this.getLibraryService()
         );
      }
      return this.orderService;
   }

   getStripeService(): StripeService {
      if (!this.stripeService) {
         this.stripeService = new StripeService(this.getOrderService());
      }
      return this.stripeService;
   }
}
