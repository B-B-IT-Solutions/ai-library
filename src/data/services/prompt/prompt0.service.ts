import { isEqual, map } from "es-toolkit/compat";

import { PromptRepository } from "@/data/repositories/prompt0";
import {
   DPrompt0,
   DPrompt0sPage,
   DPrompt0sPageQuery,
   DPrompt0Update,
} from "@/data/types/domain/prompt0";
import { updatePromptSchema } from "@/data/types/validators/prompt";

export class PromptService {
   private promptRepository: PromptRepository;

   constructor(promptRepository: PromptRepository) {
      this.promptRepository = promptRepository;
   }

   async getPrompts(
      userId: string,
      query?: DPrompt0sPageQuery
   ): Promise<DPrompt0sPage> {
      return await this.promptRepository.pGetPromptDescriptors(userId, query);
   }

   async getPrompt(userId: string, promptId: string): Promise<DPrompt0 | null> {
      return await this.promptRepository.pGetPromptDescriptor(userId, promptId);
   }

   async getPromptCategories(userId: string): Promise<string[]> {
      const categories =
         await this.promptRepository.pGetPromptCategories(userId);
      return map(categories, (c) => c.name);
   }

   async createPrompt(userId: string, data: DPrompt0Update) {
      const prompt = updatePromptSchema.parse(data);
      await this.promptRepository.pCreatePrompt(userId, prompt);
   }

   async updatePrompt(
      userId: string,
      promptId: string,
      data: DPrompt0Update,
      createVersion: boolean
   ) {
      const current = await this.promptRepository.pGetPromptDescriptor(
         userId,
         promptId
      );

      if (!current) {
         throw new Error("Prompt not found");
      }

      const update = updatePromptSchema.parse(data);
      const { content, currentVersion } = current;
      const updateVersions = createVersion && !isEqual(content, update.content);
      const versionIdx = updateVersions ? currentVersion + 1 : currentVersion;

      await this.promptRepository.pUpdatePrompt(
         userId,
         promptId,
         update,
         current,
         versionIdx,
         updateVersions
      );
   }

   async toggleFavorite(userId: string, promptId: string, isFavorite: boolean) {
      await this.promptRepository.pToggleFavorite(userId, promptId, isFavorite);
   }

   async deletePrompt(userId: string, promptId: string) {
      await this.promptRepository.pDeletePrompt(userId, promptId);
   }
}
