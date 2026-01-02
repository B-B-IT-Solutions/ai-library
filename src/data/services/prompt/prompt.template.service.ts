import { PromptTemplateRepository } from "@/data/repositories/prompt/prompt.template";
import {
   DPromptTemplateCategory,
   DPromptTemplateDescriptor,
} from "@/data/types/domain/prompt.template";

import { toDPromptTemplateDescriptors } from "./prompt.mapper";

type DGetPromptTemplatesDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export class PromptTemplateService {
   private repository: PromptTemplateRepository;

   constructor(repository: PromptTemplateRepository) {
      this.repository = repository;
   }

   async getPromptTemplateDescriptors(
      params?: DGetPromptTemplatesDescriptorsParams
   ): Promise<DPromptTemplateDescriptor[]> {
      const data = await this.repository.pGetPromptTemplateDescriptors(params);
      return toDPromptTemplateDescriptors(data);
   }

   async getPromptTemplateCategories(): Promise<DPromptTemplateCategory[]> {
      return await this.repository.pGetPromptTemplateCategories();
   }
}
