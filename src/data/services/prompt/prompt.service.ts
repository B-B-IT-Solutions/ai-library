import { isEqual, map } from "es-toolkit/compat";

import { PromptRepository } from "@/data/repositories/prompt";
import {
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
      return await this.promptRepository.pGetPromptDescriptors(userId, query);
   }

   async getPrompt(
      userId: string,
      promptId: string
   ): Promise<DPromptDescriptor | null> {
      return await this.promptRepository.pGetPromptDescriptor(userId, promptId);
   }

   async getPromptCategories(userId: string): Promise<string[]> {
      const categories =
         await this.promptRepository.pGetPromptCategories(userId);
      return map(categories, (c) => c.name);
   }

   async createPrompt(userId: string, data: DPromptUpdate) {
      const prompt = updatePromptSchema.parse(data);
      await this.promptRepository.pCreatePrompt(userId, prompt);
   }

   async updatePrompt(
      userId: string,
      promptId: string,
      data: DPromptUpdate,
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
