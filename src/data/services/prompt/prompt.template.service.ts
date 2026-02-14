import { map } from "es-toolkit/compat";

import { PromptTemplateRepository } from "@/data/repositories/prompt/prompt.template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldUpdate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { PromptTemplateDescriptorCreateInput } from "@/generated/prisma/models";

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

   async createPromptTemplateDescriptor(data: DPromptTemplateFieldUpdate) {
      const input: PromptTemplateDescriptorCreateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            connectOrCreate: map(data.categories, (categoryName: string) => ({
               where: {
                  name: categoryName,
               },
               create: {
                  name: categoryName,
               },
            })),
         },
         promptTemplate: {
            create: {
               content: data.content,
               detailedDescription: data.detailedDescription,
               fields: {
                  create: map(
                     data.fields,
                     (field: DPromptTemplateFieldUpdate) => ({
                        name: field.name,
                        label: field.label,
                        description: field.description,
                        type: field.type,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: field.options
                           ? JSON.stringify(field.options)
                           : undefined,
                     })
                  ),
               },
            },
         },
      };
      const ptd = await this.repository.pCreatePromptTemplateDescriptor(input);
      return ptd.id;
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
