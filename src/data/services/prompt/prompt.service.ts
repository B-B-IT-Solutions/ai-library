import { isEqual } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { PromptRepository } from "@/data/repositories/prompt";
import {
   toDPromptDescriptor,
   toDPromptDescriptorsPage,
} from "@/data/repositories/prompt/prompt.mapper";
import {
   DPromptCategory,
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
   DPromptUpdate,
} from "@/data/types/domain/prompt";
import { updatePromptSchema } from "@/data/types/validators/prompt";

export class PromptService {
   private promptRepository: PromptRepository;

   constructor(promptRepository: PromptRepository) {
      this.promptRepository = promptRepository;
   }

   async getPrompts(
      userId: string,
      query?: DPromptDescriptorsPageQuery
   ): Promise<DPromptDescriptorsPage> {
      const data = await this.promptRepository.pGetPromptDescriptors(
         userId,
         query
      );
      return toDPromptDescriptorsPage(data);
   }

   async getPrompt(id: string): Promise<DPromptDescriptor | undefined> {
      if (isValidUuid(id)) {
         const data = await this.promptRepository.pGetPromptDescriptor({ id });
         if (data) {
            return toDPromptDescriptor(data);
         }
      }
      return undefined;
   }

   async getPromptCategories(): Promise<DPromptCategory[]> {
      return await this.promptRepository.pGetPromptCategories();
   }

   async createPrompt(userId: string, data: DPromptUpdate) {
      const prompt = updatePromptSchema.parse(data);
      await this.promptRepository.pCreatePrompt(userId, prompt);
   }

   async updatePrompt(
      promptId: string,
      data: DPromptUpdate,
      createVersion: boolean
   ) {
      const current = await this.promptRepository.pGetPromptDescriptor({
         id: promptId,
      });

      if (!current) {
         throw new Error("Prompt not found");
      }

      const update = updatePromptSchema.parse(data);
      const { content, currentVersion } = current;
      const updateVersions = createVersion && !isEqual(content, update.content);
      const versionIdx = updateVersions ? currentVersion + 1 : currentVersion;

      await this.promptRepository.pUpdatePrompt(
         promptId,
         update,
         current,
         versionIdx,
         updateVersions
      );
   }

   async toggleFavorite(id: string, isFavorite: boolean) {
      await this.promptRepository.pToggleFavorite(id, isFavorite);
   }

   async deletePrompt(id: string) {
      await this.promptRepository.pDeletePrompt(id);
   }
}
