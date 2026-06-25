import { PublicProductRepository } from "@/data/repositories/product";
import { DProductSitemapData } from "@/data/types/domain/product";

export class ProductPublicService {
   constructor(private readonly productRepository: PublicProductRepository) {}

   async getProductsSitemapData(): Promise<DProductSitemapData[]> {
      return await this.productRepository.pGetProductsSitemapData();
   }
}
