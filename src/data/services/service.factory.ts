import { RepositoryFactory } from "@/data/repositories";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { OrderService } from "@/data/services/order";
import { StripeService } from "@/data/services/stripe";
import { DbClient } from "@/data/types/db/common";

import { PromptService } from "./prompt/prompt.service";

export class ServiceFactory {
   private repositories: RepositoryFactory;
   private cartService?: CartService;
   private libraryService?: LibraryService;
   private orderService?: OrderService;
   private stripeService?: StripeService;
   private promptService?: PromptService;

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
         this.stripeService = new StripeService(
            this.getCartService(),
            this.getOrderService()
         );
      }
      return this.stripeService;
   }

   getPromptService(): PromptService {
      if (!this.promptService) {
         this.promptService = new PromptService(
            this.repositories.promptRepository()
         );
      }
      return this.promptService;
   }
}
