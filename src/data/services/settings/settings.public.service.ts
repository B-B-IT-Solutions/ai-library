import { PublicSettingsRepository } from "@/data/repositories/settings";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

export class PublicSettingsService {
   private settingsRepository: PublicSettingsRepository;

   constructor(settingsRepository: PublicSettingsRepository) {
      this.settingsRepository = settingsRepository;
   }

   async getPublicGlobalTemplateFieldsByIds(
      ids: string[]
   ): Promise<DGlobalTemplateField[]> {
      return await this.settingsRepository.pGetPublicGlobalTemplateFieldsByIds(
         ids
      );
   }
}
