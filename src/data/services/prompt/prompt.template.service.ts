import { PromptTemplateRepository } from "@/data/repositories/prompt/prompt.template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

import {
   toDPromptTemplate,
   toDPromptTemplateDescriptors,
   toDPromptTemplateDescriptorWithTemplate,
} from "./prompt.template.mapper";
import { TemplateEngine } from "./template.engine";

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

   async getPromptTemplate(id: string): Promise<DPromptTemplate | null> {
      const data = await this.repository.pGetPromptTemplate(id);
      if (data) {
         return toDPromptTemplate(data);
      }
      return null;
   }

   async getPromptTemplateCategories(): Promise<DPromptTemplateCategory[]> {
      return await this.repository.pGetPromptTemplateCategories();
   }

   async composePromptFromTemplate(
      descriptorId: string,
      fieldValues: DPromptTemplateFieldValues
   ): Promise<DPromptUpdate> {
      const descriptor =
         await this.getPromptTemplateDescriptorWithTemplate(descriptorId);

      if (!descriptor) {
         throw new Error(
            `PromptTemplateDescriptor with id ${descriptorId}not found `
         );
      }

      const { promptTemplate } = descriptor;

      const validation = TemplateEngine.validate(
         promptTemplate.fields,
         fieldValues
      );

      if (!validation.valid) {
         throw new Error(
            `Provided template fields are invalid: ${JSON.stringify(validation.errors)}`
         );
      }

      const content = TemplateEngine.replace(
         promptTemplate.content,
         fieldValues
      );

      return {
         content: content,
         title: descriptor.title,
         recommendedModel: descriptor.recommendedModel,
         categories: descriptor.categories.map((cat) => cat.name),
         followUpPrompts: [],
      };
   }
}
