import { SettingsRepository } from "@/data/repositories/settings";
import {
   DGlobalField,
   DGlobalFieldUpdate,
} from "@/data/types/domain/global-field";

export class GlobalFieldService {
   private globalFieldRepository: SettingsRepository;

   constructor(globalFieldRepository: SettingsRepository) {
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
      return await this.globalFieldRepository.pUpdateGlobalField(
         userId,
         id,
         data
      );
   }

   async deleteGlobalField(id: string, userId: string): Promise<void> {
      await this.globalFieldRepository.pDeleteGlobalField(id, userId);
   }
}
