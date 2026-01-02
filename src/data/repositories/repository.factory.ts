import { DbClient } from "@/data/types/db/common";

import { CartRepository } from "./cart";
import { LibraryRepository } from "./library";
import { OrderRepository } from "./order";
import { ProductRepository } from "./product";
import { PromptRepository } from "./prompt";

export class RepositoryFactory {
   private prisma: DbClient;
   private cartRepo?: CartRepository;
   private libraryRepo?: LibraryRepository;
   private orderRepo?: OrderRepository;
   private productRepo?: ProductRepository;
   private promptRepo?: PromptRepository;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   cartRepository(): CartRepository {
      if (!this.cartRepo) {
         this.cartRepo = new CartRepository(this.prisma);
      }
      return this.cartRepo;
   }

   libraryRepository(): LibraryRepository {
      if (!this.libraryRepo) {
         this.libraryRepo = new LibraryRepository(this.prisma);
      }
      return this.libraryRepo;
   }

   orderRepository(): OrderRepository {
      if (!this.orderRepo) {
         this.orderRepo = new OrderRepository(this.prisma);
      }
      return this.orderRepo;
   }

   productRepository(): ProductRepository {
      if (!this.productRepo) {
         this.productRepo = new ProductRepository(this.prisma);
      }
      return this.productRepo;
   }

   promptRepository(): PromptRepository {
      if (!this.promptRepo) {
         this.promptRepo = new PromptRepository(this.prisma);
      }
      return this.promptRepo;
   }
}
