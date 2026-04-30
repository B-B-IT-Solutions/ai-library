import { SettingsRepository } from "@/data/repositories/settings";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";

export class SettingsService {
   private settingsRepository: SettingsRepository;

   constructor(settingsRepository: SettingsRepository) {
      this.settingsRepository = settingsRepository;
   }

   async getGlobalTemplateFields(
      userId: string
   ): Promise<DGlobalTemplateField[]> {
      return await this.settingsRepository.pGetGlobalTemplateFields(userId);
   }

   async getGlobalTemplateFieldsByIds(
      userId: string,
      ids: string[]
   ): Promise<DGlobalTemplateField[]> {
      return await this.settingsRepository.pGetGlobalTemplateFieldsByIds(
         userId,
         ids
      );
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
