import { SettingsRepository } from "@/data/repositories/settings";
import {
   DGlobalPromptField,
   DGlobalPromptFieldUpdate,
} from "@/data/types/domain/settings";

export class SettingsService {
   private settingsRepository: SettingsRepository;

   constructor(settingsRepository: SettingsRepository) {
      this.settingsRepository = settingsRepository;
   }

   async getGlobalPromptFields(
      userId: string
   ): Promise<DGlobalPromptField[]> {
      return await this.settingsRepository.pGetGlobalPromptFields(userId);
   }

   async getGlobalPromptFieldsByIds(
      userId: string,
      ids: string[]
   ): Promise<DGlobalPromptField[]> {
      return await this.settingsRepository.pGetGlobalPromptFieldsByIds(
         userId,
         ids
      );
   }

   async createGlobalPromptField(
      userId: string,
      data: DGlobalPromptFieldUpdate
   ): Promise<DGlobalPromptField> {
      return await this.settingsRepository.pCreateGlobalPromptField(
         userId,
         data
      );
   }

   async updateGlobalPromptField(
      userId: string,
      id: string,
      data: DGlobalPromptFieldUpdate
   ): Promise<DGlobalPromptField> {
      return await this.settingsRepository.pUpdateGlobalPromptField(
         userId,
         id,
         data
      );
   }

   async deleteGlobalPromptField(userId: string, id: string): Promise<void> {
      await this.settingsRepository.pDeleteGlobalPromptField(userId, id);
   }
}
