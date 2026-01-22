import { isEqual, map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { PromptRepository } from "@/data/repositories/prompt";
import {
   DPromptCategory,
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
   DPromptUpdate,
} from "@/data/types/domain/prompt";
import { updatePromptSchema } from "@/data/types/validators/prompt";
import {
   PromptCategoryCreateOrConnectWithoutPromptsInput,
   PromptDescriptorCreateInput,
   PromptDescriptorUpdateInput,
   PromptFollowUpCreateWithoutPromptInput,
} from "@/generated/prisma/models";

import { toDPromptDescriptor, toDPromptDescriptorsPage } from "./prompt.mapper";

export class PromptService {
   private promptRepository: PromptRepository;

   constructor(promptRepository: PromptRepository) {
      this.promptRepository = promptRepository;
   }

   async getPrompts(
      query?: DPromptDescriptorsPageQuery
   ): Promise<DPromptDescriptorsPage> {
      const data = await this.promptRepository.pGetPromptDescriptors(query);
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

   async createPrompt(data: DPromptUpdate) {
      const prompt = updatePromptSchema.parse(data);
      const categories = this.createOrConnectCategories(prompt.categories);
      const followUps = this.createFollowUps(prompt.followUpPrompts || []);

      const toSave: PromptDescriptorCreateInput = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
         currentVersion: 0,
         categories: {
            connectOrCreate: categories,
         },
         followUpPrompts: {
            create: followUps,
         },
      };

      await this.promptRepository.pCreatePrompt(toSave);
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

      let versions = undefined;
      if (updateVersions) {
         versions = {
            create: {
               version: versionIdx,
               content: update.content,
            },
         };
      }

      const categories = this.createOrConnectCategories(update.categories);
      const followUps = this.createFollowUps(update.followUpPrompts || []);

      const toSave: PromptDescriptorUpdateInput = {
         title: update.title,
         content: update.content,
         recommendedModel: update.recommendedModel,
         currentVersion: versionIdx,
         categories: {
            set: [],
            connectOrCreate: categories,
         },
         followUpPrompts: {
            deleteMany: {},
            create: followUps,
         },
         versions,
      };

      await this.promptRepository.pUpdatePrompt(promptId, toSave);
   }

   async deletePrompt(id: string) {
      await this.promptRepository.pDeletePrompt(id);
   }

   async toggleFavorite(id: string, isFavorite: boolean) {
      await this.promptRepository.pToggleFavorite(id, isFavorite);
   }

   private createOrConnectCategories(
      categories: string[]
   ): PromptCategoryCreateOrConnectWithoutPromptsInput[] {
      return map(categories, (cat: string) => {
         return {
            where: {
               name: cat,
            },
            create: {
               name: cat,
            },
         };
      });
   }

   private createFollowUps(
      followUpPrompts: string[]
   ): PromptFollowUpCreateWithoutPromptInput[] {
      return map(followUpPrompts, (content: string, index: number) => {
         return {
            content,
            order: index,
         };
      });
   }
}
