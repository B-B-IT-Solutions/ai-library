import { map } from "es-toolkit/compat";

import { TemplateRepository } from "@/data/repositories/prompt";
import {
   DPrompt,
   DPromptFieldValues,
   DPromptGenerationData,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptsUsage,
   DPromptUpdate,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { requireCountLimit, TIER_FEATURES } from "@/lib/subscription";
import { TemplateEngine } from "@/lib/template";
import { SettingsService } from "../settings";
import { SubscriptionService } from "../subscription";

import { resolveAllTemplateFields } from "./utils";

type DGetPromptTemplatesDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export class TemplateService {
   constructor(
      private readonly repository: TemplateRepository,
      private readonly settingService: SettingsService,
      private readonly subscriptionService: SubscriptionService
   ) {}

   async getTemplateDescriptorsPage(
      userId: string,
      query?: DPromptsPageQuery
   ): Promise<DPromptsPage> {
      return await this.repository.pGetTemplateDescriptorsPage(userId, query);
   }

   async getTemplateDescriptor(
      userId: string,
      descriptorId: string
   ): Promise<DPrompt | null> {
      return await this.repository.pGetTemplateDescriptor(userId, descriptorId);
   }

   async createPrompt(userId: string, data: DPromptUpdate): Promise<DPrompt> {
      const currentCount = await this.getPromptsCount(userId);
      await requireCountLimit("maxPrompts", currentCount);

      return await this.repository.pCreatePrompt(userId, data);
   }

   async updateTemplateDescriptor(
      userId: string,
      descriptorId: string,
      data: DPromptUpdate
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
   ): Promise<DPromptGenerationData | null> {
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
   ): Promise<DPrompt[]> {
      return await this.repository.pGetPrompts(params);
   }

   async getPromptTemplate(
      userId: string,
      templateId: string
   ): Promise<DPromptWithContent | null> {
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

   async getPromptsUsage(userId: string): Promise<DPromptsUsage> {
      const [current, tier] = await Promise.all([
         this.getPromptsCount(userId),
         this.subscriptionService.getUserTier(userId),
      ]);

      const limit = TIER_FEATURES[tier].maxPrompts;
      return {
         current,
         limit,
      };
   }

   async getPromptsCount(userId: string): Promise<number> {
      return await this.repository.pGetPromptsCount(userId);
   }
}
