import { isEqual, map } from "es-toolkit/compat";

import { Prompt0Repository } from "@/data/repositories/prompt0";
import {
   DPrompt0,
   DPrompt0sPage,
   DPrompt0sPageQuery,
   DPrompt0Update,
} from "@/data/types/domain/prompt0";
import { updatePromptSchema } from "@/data/types/validators/prompt";

export class Prompt0Service {
   private prompt0Repository: Prompt0Repository;

   constructor(promptRepository: Prompt0Repository) {
      this.prompt0Repository = promptRepository;
   }

   async getPrompt0s(
      userId: string,
      query?: DPrompt0sPageQuery
   ): Promise<DPrompt0sPage> {
      return await this.prompt0Repository.pGetPrompt0s(userId, query);
   }

   async getPrompt0(
      userId: string,
      promptId: string
   ): Promise<DPrompt0 | null> {
      return await this.prompt0Repository.pGetPrompt0(userId, promptId);
   }

   async getPrompt0Categories(userId: string): Promise<string[]> {
      const categories =
         await this.prompt0Repository.pGetPrompt0Categories(userId);
      return map(categories, (c) => c.name);
   }

   async createPrompt0(userId: string, data: DPrompt0Update) {
      const prompt = updatePromptSchema.parse(data);
      await this.prompt0Repository.pCreatePrompt0(userId, prompt);
   }

   async updatePrompt0(
      userId: string,
      promptId: string,
      data: DPrompt0Update,
      createVersion: boolean
   ) {
      const current = await this.prompt0Repository.pGetPrompt0(
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

      await this.prompt0Repository.pUpdatePrompt0(
         userId,
         promptId,
         update,
         current,
         versionIdx,
         updateVersions
      );
   }

   async deletePrompt0(userId: string, promptId: string) {
      await this.prompt0Repository.pDeletePrompt0(userId, promptId);
   }

   async toggleFavorite(userId: string, promptId: string, isFavorite: boolean) {
      await this.prompt0Repository.pToggleFavorite(
         userId,
         promptId,
         isFavorite
      );
   }
}
