import { SettingsRepository } from "@/data/repositories/settings";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";

export class SettingsService {
   private settingsRepository: SettingsRepository;

   constructor(globalFieldRepository: SettingsRepository) {
      this.settingsRepository = globalFieldRepository;
   }

   async getGlobalFields(userId: string): Promise<DGlobalTemplateField[]> {
      return await this.settingsRepository.pGetGlobalFields(userId);
   }

   async createGlobalField(
      userId: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalTemplateField> {
      return await this.settingsRepository.pCreateGlobalField(userId, data);
   }

   async updateGlobalField(
      userId: string,
      id: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalTemplateField> {
      return await this.settingsRepository.pUpdateGlobalField(userId, id, data);
   }

   async deleteGlobalField(userId: string, id: string): Promise<void> {
      await this.settingsRepository.pDeleteGlobalField(userId, id);
   }
}
