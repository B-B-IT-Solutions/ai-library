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

   async getGlobalTemplateFields(
      userId: string
   ): Promise<DGlobalTemplateField[]> {
      return await this.settingsRepository.pGetGlobalTemplateFields(userId);
   }

   async createGlobalTemplateField(
      userId: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalTemplateField> {
      return await this.settingsRepository.pCreateGlobalTemplateField(
         userId,
         data
      );
   }

   async updateGlobalTemplateField(
      userId: string,
      id: string,
      data: DGlobalTemplateFieldUpdate
   ): Promise<DGlobalTemplateField> {
      return await this.settingsRepository.pUpdateGlobalTemplateField(
         userId,
         id,
         data
      );
   }

   async deleteGlobalTemplateField(userId: string, id: string): Promise<void> {
      await this.settingsRepository.pDeleteGlobalTemplateField(userId, id);
   }
}
