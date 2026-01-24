import { RepositoryFactory } from "@/data/repositories";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { OrderService } from "@/data/services/order";
import { PromptService, PromptTemplateService } from "@/data/services/prompt";
import { StripeService } from "@/data/services/stripe";
import { UserService } from "@/data/services/user";
import { DbClient } from "@/data/types/db/common";

export class ServiceFactory {
   private repositories: RepositoryFactory;
   private userService?: UserService;
   private cartService?: CartService;
   private libraryService?: LibraryService;
   private orderService?: OrderService;
   private stripeService?: StripeService;
   private promptService?: PromptService;
   private promptTemplateService?: PromptTemplateService;

   constructor(prisma: DbClient) {
      this.repositories = new RepositoryFactory(prisma);
   }

   getUserService(): UserService {
      if (!this.userService) {
         this.userService = new UserService(
            this.repositories.userRepository(),
            this.getCartService()
         );
      }
      return this.userService;
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
            this.repositories.libraryRepository(),
            this.getPromptService()
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

   getPromptTemplateService(): PromptTemplateService {
      if (!this.promptTemplateService) {
         this.promptTemplateService = new PromptTemplateService(
            this.repositories.promptTemplateRepository()
         );
      }
      return this.promptTemplateService;
   }
}
