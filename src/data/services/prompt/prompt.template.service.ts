import { PromptTemplateRepository } from "@/data/repositories/prompt/prompt.template";
import {
   DPromptTemplateCategory,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
} from "@/data/types/domain/prompt.template";

import {
   toDPromptTemplateDescriptors,
   toDPromptTemplateDescriptorWithTemplate,
} from "./prompt.template.mapper";

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

   async getPromptTemplateDescriptorWithTemplate(
      id: string
   ): Promise<DPromptTemplateDescriptorWithTemplate | null> {
      const data =
         await this.repository.pGetPromptTemplateDescriptorWithTemplate(id);
      if (data) {
         return toDPromptTemplateDescriptorWithTemplate(data);
      }
      return null;
   }

   async getPromptTemplateCategories(): Promise<DPromptTemplateCategory[]> {
      return await this.repository.pGetPromptTemplateCategories();
   }
}
