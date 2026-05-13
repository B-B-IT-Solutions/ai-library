import { map } from "es-toolkit/compat";

import { TemplateRepository } from "@/data/repositories/template";
import { DPrompt0Update } from "@/data/types/domain/prompt";
import {
   DPromptFieldValues,
   DPromptTemplate,
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
   DPromptTemplateUpdate,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { TemplateEngine } from "@/lib/template";
import { SettingsService } from "../settings";

import { resolveAllTemplateFields } from "./utils";

type DGetPromptTemplatesDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export class TemplateService {
   private repository: TemplateRepository;
   private settingService: SettingsService;

   constructor(
      repository: TemplateRepository,
      settingsService: SettingsService
   ) {
      this.repository = repository;
      this.settingService = settingsService;
   }

   async getTemplateDescriptorsPage(
      userId: string,
      query?: DTemplateDescriptorsPageQuery
   ): Promise<DTemplateDescriptorsPage> {
      return await this.repository.pGetTemplateDescriptorsPage(userId, query);
   }

   async getTemplateDescriptor(
      userId: string,
      descriptorId: string
   ): Promise<DPromptTemplateDescriptor | null> {
      return await this.repository.pGetTemplateDescriptor(userId, descriptorId);
   }

   async createTemplateDescriptor(
      userId: string,
      data: DPromptTemplateUpdate
   ): Promise<DPromptTemplateDescriptor> {
      return await this.repository.pCreatePrompt(userId, data);
   }

   async updateTemplateDescriptor(
      userId: string,
      descriptorId: string,
      data: DPromptTemplateUpdate
   ) {
      const descriptor = await this.getTemplateDescriptor(userId, descriptorId);
      if (!descriptor) {
         throw new Error("TemplateDescriptor not found");
      }

      await this.repository.pUpdatePrompt(userId, descriptorId, data);
   }

   async deleteTemplateDescriptor(userId: string, descriptorId: string) {
      const descriptor = await this.getTemplateDescriptor(userId, descriptorId);
      if (!descriptor) {
         throw new Error("TemplateDescriptor not found");
      }

      await this.repository.pDeletePrompt(userId, descriptorId);
   }

   async getTemplateDataForPromptGeneration(
      userId: string,
      teamplateId: string
   ): Promise<DPromptTemplateDataPromptGeneration | null> {
      const template = await this.getPromptTemplate(userId, teamplateId);

      if (template) {
         const globalFields =
            await this.settingService.getGlobalPromptFieldsByIds(
               userId,
               template.globalFieldIds
            );

         const allFields = resolveAllTemplateFields(template, globalFields);

         return {
            template,
            allFields,
         };
      }

      return null;
   }

   async composePromptFromTemplate(
      userId: string,
      descriptorId: string,
      fieldValues: DPromptFieldValues
   ): Promise<DPrompt0Update> {
      const descriptor = await this.getTemplateDescriptor(userId, descriptorId);

      if (!descriptor) {
         throw new Error(
            `TemplateDescriptor with ID ${descriptorId} not found`
         );
      }

      const template = await this.getPromptTemplate(userId, descriptor.id);

      if (!template) {
         throw new Error(`Template with ID ${descriptor.id} not found`);
      }

      const validation = TemplateEngine.validate(template.fields, fieldValues);

      if (!validation.valid) {
         throw new Error(
            `Provided template fields are invalid: ${JSON.stringify(validation.errors)}`
         );
      }

      const content = TemplateEngine.replace(template.content, fieldValues);

      return {
         content: content,
         title: descriptor.title,
         recommendedModel: descriptor.recommendedModel,
         categories: descriptor.categories.map((cat) => cat.name),
         followUpPrompts: [],
      };
   }

   async downloadTemplate(
      userId: string,
      descriptorId: string
   ): Promise<string> {
      const descriptor = await this.getTemplateDescriptor(userId, descriptorId);

      if (!descriptor) {
         throw new Error(
            `TemplateDescriptor with ID ${descriptorId} not found`
         );
      }

      const template = await this.getPromptTemplate(userId, descriptor.id);

      if (!template) {
         throw new Error(`Template with ID ${descriptor.id} not found`);
      }

      const downloadData = JSON.stringify(
         {
            title: descriptor.title,
            content: template.content,
            categories: descriptor.categories.map((c) => c.name),
            recommendedModel: descriptor.recommendedModel,
         },
         null,
         2
      );

      return downloadData;
   }

   async toggleTemplateDescriptorFavorite(
      userId: string,
      descriptorId: string,
      isFavorite: boolean
   ) {
      await this.repository.pToggleFavorite(userId, descriptorId, isFavorite);
   }

   async getPrompts(
      params?: DGetPromptTemplatesDescriptorsParams
   ): Promise<DPromptTemplateDescriptor[]> {
      return await this.repository.pGetPrompts(params);
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

   async getTemplateDescriptorCategories(userId: string): Promise<string[]> {
      return await this.repository.pGetTemplateCategories(userId);
   }

   async getTemplateDescriptorModels(userId: string): Promise<string[]> {
      return await this.repository.pGetTemplateModels(userId);
   }
}
