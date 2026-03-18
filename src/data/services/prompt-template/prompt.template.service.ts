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
      const template = await this.getPromptTemplate(userId, teamplateId);

      if (template) {
         const globalFields =
            await this.settingService.getGlobalTemplateFieldsByIds(
               userId,
               template.globalFieldIds
            );

         const allFields = this.resolveAllTemplateFields(
            template,
            globalFields
         );

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
      userId: string,
      descriptorId: string
   ): Promise<DPromptTemplateDescriptorWithTemplate | null> {
      return await this.repository.pGetPromptTemplateDescriptorWithTemplate(
         userId,
         descriptorId
      );
   }

   async getPromptTemplate(
      userId: string,
      templateId: string
   ): Promise<DPromptTemplate | null> {
      return await this.repository.pGetPromptTemplate(userId, templateId);
   }

   async getPromptTemplateCategories(userId: string): Promise<string[]> {
      const categories =
         await this.repository.pGetPromptTemplateCategories(userId);
      return map(categories, (c) => c.name);
   }

   async createPromptTemplateDescriptor(
      userId: string,
      data: DPromptTemplateUpdate
   ): Promise<DPromptTemplateDescriptor> {
      return await this.repository.pCreatePromptTemplateDescriptor(
         userId,
         data
      );
   }

   async updatePromptTemplateDescriptor(
      userId: string,
      descriptorId: string,
      data: DPromptTemplateUpdate
   ) {
      await this.repository.pUpdatePromptTemplateDescriptor(
         userId,
         descriptorId,
         data
      );
   }

   async composePromptFromTemplate(
      userId: string,
      descriptorId: string,
      fieldValues: DPromptTemplateFieldValues
   ): Promise<DPromptUpdate> {
      const descriptor =
         await this.getPromptTemplateDescriptorWithTemplate(userId, descriptorId);

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

   resolveAllTemplateFields(
      template: DPromptTemplate,
      globalFields: DGlobalTemplateField[]
   ) {
      const allFieldNames = new Set([
         ...map(template.fields, (f) => f.name),
         ...map(globalFields, (f) => f.name),
      ]);
      const allVariableNames = TemplateEngine.extractVariables(
         template.content
      );
      const missingVariableNames = filter(
         allVariableNames,
         (name) => !allFieldNames.has(name)
      );

      return [
         ...template.fields,
         ...this.globalFieldsToTemplateFields(globalFields),
         ...this.missingVariablesToTemplateFields(missingVariableNames),
      ];
   }

   private globalFieldsToTemplateFields(
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
