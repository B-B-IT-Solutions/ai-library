import { RepositoryFactory } from "@/data/db/queries/repository.factory";
import { CartService } from "@/data/services/cart";
import { LibraryService } from "@/data/services/library";
import { OrderService } from "@/data/services/order";
import { DbClient } from "@/data/types/db/common";

export class ServiceFactory {
   private repositories: RepositoryFactory;
   private cartService?: CartService;
   private libraryService?: LibraryService;
   private orderService?: OrderService;

   constructor(prisma: DbClient) {
      this.repositories = new RepositoryFactory(prisma);
   }

   getCartService(): CartService {
      if (!this.cartService) {
         const cartRepository = this.repositories.cartRepository();
         this.cartService = new CartService(cartRepository);
      }
      return this.cartService;
   }

   getLibraryService(): LibraryService {
      if (!this.libraryService) {
         const libraryRepository = this.repositories.libraryRepository();
         this.libraryService = new LibraryService(libraryRepository);
      }
      return this.libraryService;
   }

   getOrderService(): OrderService {
      if (!this.orderService) {
         const orderRepository = this.repositories.orderRepository();
         const cartService = this.getCartService();
         const libraryService = this.getLibraryService();
         this.orderService = new OrderService(
            orderRepository,
            cartService,
            libraryService
         );
      }
      return this.orderService;
   }
}
