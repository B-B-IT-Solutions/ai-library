import { map } from "es-toolkit/compat";

import { PromptRepository } from "@/data/repositories/prompt";
import {
   DPrompt,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptsUsage,
   DPromptTemplatingData,
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptVariableValues,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { FeatureName, TIER_FEATURES } from "@/lib/subscription/access-control";
import { TemplateEngine } from "@/lib/template";
import { CollectionService } from "../collection";
import { SettingsService } from "../settings";
import { SubscriptionService } from "../subscription";

import { resolveAllTemplateFields } from "./utils";

export class PromptService {
   constructor(
      private readonly repository: PromptRepository,
      private readonly settingService: SettingsService,
      private readonly subscriptionService: SubscriptionService,
      private readonly collectionService: CollectionService
   ) {}

   async getPromptsPage(
      userId: string,
      query?: DPromptsPageQuery
   ): Promise<DPromptsPage> {
      return await this.repository.pGetPromptsPage(userId, query);
   }

   async getPromptPreviewsPage(
      userId: string,
      query?: DPromptPreviewsPageQuery
   ): Promise<DPromptPreviewsPage> {
      return await this.repository.pGetPromptPreviewsPage(userId, query);
   }

   async getPrompt(
      userId: string,
      descriptorId: string
   ): Promise<DPrompt | null> {
      return await this.repository.pGetPrompt(userId, descriptorId);
   }

   async getPromptWithContent(
      userId: string,
      promptId: string
   ): Promise<DPromptWithContent | null> {
      return await this.repository.pGetPromptContent(userId, promptId);
   }

   async createPrompt(
      userId: string,
      crate: DPromptUpdateCrate
   ): Promise<DPrompt> {
      const currentCount = await this.getPromptsCount(userId);
      const feature: FeatureName = "maxPrompts";
      await this.subscriptionService.requireCountLimit(
         userId,
         feature,
         currentCount
      );

      const { data, collectionId } = crate;

      const prompt = await this.repository.pCreatePrompt(userId, data);

      if (collectionId) {
         this.collectionService.addPromptToCollection(
            userId,
            collectionId,
            prompt.id
         );
      }

      return prompt;
   }

   async updatePrompt(
      userId: string,
      descriptorId: string,
      data: DPromptUpdate
   ) {
      const prompt = await this.getPrompt(userId, descriptorId);
      if (!prompt) {
         throw new Error("TemplateDescriptor not found");
      }

      await this.repository.pUpdatePrompt(userId, descriptorId, data);
   }

   async deletePrompt(userId: string, descriptorId: string) {
      const prompt = await this.getPrompt(userId, descriptorId);
      if (!prompt) {
         throw new Error("TemplateDescriptor not found");
      }

      await this.repository.pDeletePrompt(userId, descriptorId);
   }

   async getPromptGenerationData(
      userId: string,
      promptId: string
   ): Promise<DPromptTemplatingData | null> {
      const prompt = await this.getPromptWithContent(userId, promptId);

      if (prompt) {
         const globalFields =
            await this.settingService.getGlobalPromptFieldsByIds(
               userId,
               prompt.globalFieldIds
            );

         const allFields = resolveAllTemplateFields(prompt, globalFields);

         return {
            template: prompt,
            allFields,
         };
      }

      return null;
   }

   async composePromptFromTemplate(
      userId: string,
      descriptorId: string,
      fieldValues: DPromptVariableValues
   ): Promise<DPrompt0Update> {
      const descriptor = await this.getPrompt(userId, descriptorId);

      if (!descriptor) {
         throw new Error(
            `TemplateDescriptor with ID ${descriptorId} not found`
         );
      }

      const template = await this.getPromptWithContent(userId, descriptor.id);

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

   async downloadPrompt(userId: string, descriptorId: string): Promise<string> {
      const descriptor = await this.getPrompt(userId, descriptorId);

      if (!descriptor) {
         throw new Error(
            `TemplateDescriptor with ID ${descriptorId} not found`
         );
      }

      const template = await this.getPromptWithContent(userId, descriptor.id);

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

   async togglePromptFavorite(
      userId: string,
      descriptorId: string,
      isFavorite: boolean
   ) {
      await this.repository.pToggleFavorite(userId, descriptorId, isFavorite);
   }

   async getPromptTemplateCategories(userId: string): Promise<string[]> {
      const categories = await this.repository.pGetPromptCategories(userId);
      return map(categories, (c) => c.name);
   }

   async getPromptCategories(userId: string): Promise<string[]> {
      return await this.repository.pGePromptCategories(userId);
   }

   async getPromptModels(userId: string): Promise<string[]> {
      return await this.repository.pGetPromptModels(userId);
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
