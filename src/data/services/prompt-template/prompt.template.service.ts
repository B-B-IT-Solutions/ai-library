import { map } from "es-toolkit/compat";

import { PromptTemplateRepository } from "@/data/repositories/prompt-template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { SettingsService } from "../settings";

import { TemplateEngine } from "./template.engine";

type DGetPromptTemplatesDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export class PromptTemplateService {
   private repository: PromptTemplateRepository;
   private settingService: SettingsService;

   constructor(
      repository: PromptTemplateRepository,
      settingsService: SettingsService
   ) {
      this.repository = repository;
      this.settingService = settingsService;
   }

   async getTemplateDataForPromptGeneration(
      userId: string,
      teamplateId: string
   ): Promise<DPromptTemplateDataPromptGeneration | null> {
      const template = await this.getPromptTemplate(teamplateId);

      if (template) {
         const globalFields =
            await this.settingService.getGlobalTemplateFieldsByIds(
               userId,
               template.globalFieldIds
            );

         const existingFieldNames = new Set(
            map(template.fields, (f) => f.name)
         );
         const missingVariables = TemplateEngine.extractVariables(
            template.content
         ).filter((name) => !existingFieldNames.has(name));

         const resolvedTemplate =
            missingVariables.length === 0
               ? template
               : {
                    ...template,
                    fields: [
                       ...template.fields,
                       ...missingVariables.map((name, index) => ({
                          id: name,
                          promptTemplateId: template.id,
                          name,
                          label: name,
                          description: null,
                          type: "TEXT" as const,
                          required: true,
                          order: template.fields.length + index,
                          defaultValue: null,
                       })),
                    ],
                 };

         return {
            template: resolvedTemplate,
            globalFields,
         };
      }
      return null;
   }

   async getPromptTemplateDescriptors(
      params?: DGetPromptTemplatesDescriptorsParams
   ): Promise<DPromptTemplateDescriptor[]> {
      return await this.repository.pGetPromptTemplateDescriptors(params);
   }

   async getPromptTemplateDescriptorWithTemplate(
      id: string
   ): Promise<DPromptTemplateDescriptorWithTemplate | null> {
      return await this.repository.pGetPromptTemplateDescriptorWithTemplate(id);
   }

   async getPromptTemplate(id: string): Promise<DPromptTemplate | null> {
      return await this.repository.pGetPromptTemplate(id);
   }

   async getPromptTemplateCategories(): Promise<DPromptTemplateCategory[]> {
      return await this.repository.pGetPromptTemplateCategories();
   }

   async createPromptTemplateDescriptor(
      data: DPromptTemplateUpdate
   ): Promise<DPromptTemplateDescriptor> {
      return await this.repository.pCreatePromptTemplateDescriptor(data);
   }

   async updatePromptTemplateDescriptor(
      descriptorId: string,
      data: DPromptTemplateUpdate
   ) {
      await this.repository.pUpdatePromptTemplateDescriptor(descriptorId, data);
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
