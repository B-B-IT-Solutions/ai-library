import { filter, map } from "es-toolkit/compat";

import { PromptTemplateRepository } from "@/data/repositories/prompt-template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateField,
   DPromptTemplateFieldValues,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
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
         const existingTemplateVariables = TemplateEngine.extractVariables(
            template.content
         );
         const missingTemplateVariables = filter(
            existingTemplateVariables,
            (name) => !existingFieldNames.has(name)
         );

         const allFields = [
            ...template.fields,
            ...this.globalFieldToTemplateFields(globalFields),
            ...this.missingVariablesToTemplateFields(missingTemplateVariables),
         ];

         return {
            template,
            allFields,
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

   private globalFieldToTemplateFields(
      gfs: DGlobalTemplateField[]
   ): DPromptTemplateField[] {
      return map(gfs, this.globalFieldToTemplateField);
   }

   private globalFieldToTemplateField(
      gf: DGlobalTemplateField
   ): DPromptTemplateField {
      return {
         id: gf.id,
         promptTemplateId: "",
         name: gf.name,
         label: gf.label,
         description: gf.description,
         type: gf.type,
         required: gf.required,
         order: gf.order,
         defaultValue: gf.defaultValue,
         options: gf.options,
      };
   }

   private missingVariablesToTemplateFields(
      variableNames: string[]
   ): DPromptTemplateField[] {
      return map(variableNames, (v, idx) =>
         this.missingVariableToTemplateField(v, idx)
      );
   }

   private missingVariableToTemplateField(
      name: string,
      index: number
   ): DPromptTemplateField {
      return {
         id: name,
         promptTemplateId: "",
         name,
         label: name,
         description: null,
         type: "TEXT" as const,
         required: true,
         order: 100 + index,
         defaultValue: null,
      };
   }
}
