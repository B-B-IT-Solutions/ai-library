import { map } from "es-toolkit/compat";

import { PromptTemplateRepository } from "@/data/repositories/prompt/prompt.template";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

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

   async getPromptTemplateCategories(): Promise<string[]> {
      const categories = await this.repository.pGetPromptTemplateCategories();
      return map(categories, (c) => c.name);
   }
}
