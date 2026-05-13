import { PublicSettingsRepository } from "@/data/repositories/settings";
import { DGlobalPromptField } from "@/data/types/domain/settings";

export class PublicSettingsService {
   private settingsRepository: PublicSettingsRepository;

   constructor(settingsRepository: PublicSettingsRepository) {
      this.settingsRepository = settingsRepository;
   }

   async getPublicGlobalPromptFieldsByIds(
      ids: string[]
   ): Promise<DGlobalPromptField[]> {
      return await this.settingsRepository.pGetPublicGlobalPromptFieldsByIds(
         ids
      );
   }
}
