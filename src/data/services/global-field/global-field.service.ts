import { GlobalFieldRepository } from "@/data/repositories/global-field";
import { DGlobalField, DGlobalFieldUpdate } from "@/data/types/domain/global-field";

export class GlobalFieldService {
   private globalFieldRepository: GlobalFieldRepository;

   constructor(globalFieldRepository: GlobalFieldRepository) {
      this.globalFieldRepository = globalFieldRepository;
   }

   async getGlobalFields(userId: string): Promise<DGlobalField[]> {
      return await this.globalFieldRepository.pGetGlobalFields(userId);
   }

   async createGlobalField(
      userId: string,
      data: DGlobalFieldUpdate
   ): Promise<DGlobalField> {
      return await this.globalFieldRepository.pCreateGlobalField(userId, data);
   }

   async updateGlobalField(
      id: string,
      userId: string,
      data: DGlobalFieldUpdate
   ): Promise<DGlobalField> {
      return await this.globalFieldRepository.pUpdateGlobalField(id, userId, data);
   }

   async deleteGlobalField(id: string, userId: string): Promise<void> {
      await this.globalFieldRepository.pDeleteGlobalField(id, userId);
   }
}
