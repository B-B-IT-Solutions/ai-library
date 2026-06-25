import { ProductRepository } from "@/data/repositories/product";
import { DProductSitemapData } from "@/data/types/domain/product";

export class ProductService {
   constructor(private readonly productRepository: ProductRepository) {}

   async getProductsSitemapData(): Promise<DProductSitemapData[]> {
      return await this.productRepository.pGetProductsSitemapData();
   }
}
