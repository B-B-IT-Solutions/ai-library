import { map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { formatError } from "@/data/actions/utils";
import { PromptRepository } from "@/data/repositories/prompt";
import {
   DPromptCreate,
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
} from "@/data/types/domain/prompt";
import { createPromptSchema } from "@/data/types/validators/prompt.schema";
import {
   PromptCategoryCreateOrConnectWithoutPromptsInput,
   PromptCreateInput,
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

   async getPromptCategories(): Promise<string[]> {
      const categories = await this.promptRepository.pGetPromptCategories();
      return map(categories, (c) => c.name);
   }

   async createPrompt(data: DPromptCreate) {
      const prompt = createPromptSchema.parse(data);
      const categories = this.createOrConnectCategories(prompt.categories);

      const toSave: PromptCreateInput = {
         content: prompt.content,
         descriptor: {
            create: {
               title: prompt.title,
               recommendedModel: prompt.recommendedModel,
               categories: {
                  connectOrCreate: categories,
               },
            },
         },
      };
      await this.promptRepository.pCreatePrompt(toSave);
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
}
