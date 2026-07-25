import { trim } from "es-toolkit/compat";

import { PromptRepository } from "@/data/repositories/prompt";
import {
   DPrompt,
   DPromptCategoriesPage,
   DPromptCategoriesPageQuery,
   DPromptCategoryUpdate,
   DPromptCategoryWithUsage,
   DPromptModelsPage,
   DPromptModelsPageQuery,
   DPromptModelUpdate,
   DPromptModelWithUsage,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptsUsage,
   DPromptTemplatingData,
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptUpdateOptions,
   DPromptVersion,
   DPromptVersionsPageQuery,
   DPromptVersionsResult,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import {
   canAccessFeature,
   FeatureName,
   getFeatureLimit,
   TIER_FEATURES,
} from "@/lib/subscription/access-control";
import { CollectionService } from "../collection";
import { SettingsService } from "../settings";
import { SubscriptionService } from "../subscription";

import { NameConflictError } from "./errors";
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
      data: DPromptUpdate,
      versionOptions?: DPromptUpdateOptions
   ) {
      const prompt = await this.getPrompt(userId, descriptorId);
      if (!prompt) {
         throw new Error("TemplateDescriptor not found");
      }

      let maxStoredVersions: number | undefined;
      if (versionOptions?.saveAsVersion) {
         const tier = await this.subscriptionService.requireFeatureAccess(
            userId,
            "canAccessVersionHistory"
         );
         maxStoredVersions = getFeatureLimit(
            tier,
            "maxStoredPromptVersions"
         ) as number;
      }

      await this.repository.pUpdatePromptWithVersioning(
         userId,
         descriptorId,
         data,
         versionOptions,
         maxStoredVersions
      );
   }

   async getPromptVersions(
      userId: string,
      promptId: string,
      query?: DPromptVersionsPageQuery
   ): Promise<DPromptVersionsResult> {
      const tier = await this.subscriptionService.getUserTier(userId);
      if (!canAccessFeature(tier, "canAccessVersionHistory")) {
         return { locked: true };
      }

      const prompt = await this.getPromptWithContent(userId, promptId);
      if (!prompt) {
         throw new Error("TemplateDescriptor not found");
      }

      const [page, latestVersionContent] = await Promise.all([
         this.repository.pGetPromptVersionsPage(promptId, query?.pagination),
         this.repository.pGetLatestPromptVersionContent(promptId),
      ]);

      const hasUnversionedChanges =
         latestVersionContent !== null && latestVersionContent !== prompt.content;

      return { locked: false, page, hasUnversionedChanges };
   }

   async getPromptVersion(
      userId: string,
      promptId: string,
      versionId: string
   ): Promise<DPromptVersion | null> {
      await this.subscriptionService.requireFeatureAccess(
         userId,
         "canAccessVersionHistory"
      );

      return await this.repository.pGetPromptVersion(
         userId,
         promptId,
         versionId
      );
   }

   async restorePromptVersion(
      userId: string,
      promptId: string,
      versionId: string,
      keepCurrentAsVersion: boolean = true
   ): Promise<void> {
      const tier = await this.subscriptionService.requireFeatureAccess(
         userId,
         "canAccessVersionHistory"
      );

      const version = await this.repository.pGetPromptVersion(
         userId,
         promptId,
         versionId
      );
      if (!version) {
         throw new Error("Version not found");
      }

      const maxStoredVersions = getFeatureLimit(
         tier,
         "maxStoredPromptVersions"
      ) as number;

      // Restore runs through the exact same "archive the outgoing content first"
      // rule as a normal editor save-as-version (see pRestorePromptContent) — no
      // special case is needed, only the content being written differs.
      await this.repository.pRestorePromptContent(
         promptId,
         version.content,
         {
            saveAsVersion: keepCurrentAsVersion,
            versionNote: keepCurrentAsVersion
               ? `Automatisch gesichert vor Wiederherstellen von Version ${version.versionNumber}`
               : undefined,
         },
         maxStoredVersions
      );
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

         const allVariables = resolveAllTemplateFields(prompt, globalFields);

         return {
            prompt,
            allVariables,
         };
      }

      return null;
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
            recommendedModel: descriptor.model,
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

   async getPromptCategoriesPage(
      userId: string,
      query?: DPromptCategoriesPageQuery
   ): Promise<DPromptCategoriesPage> {
      return await this.repository.pGetPromptCategoriesPage(userId, query);
   }

   async getPromptCategories(userId: string): Promise<string[]> {
      return await this.repository.pGetPromptCategories(userId);
   }

   async getPromptCategoriesWithUsage(
      userId: string
   ): Promise<DPromptCategoryWithUsage[]> {
      return await this.repository.pGetPromptCategoriesWithUsage(userId);
   }

   async createPromptCategory(
      userId: string,
      data: DPromptCategoryUpdate
   ): Promise<void> {
      const { name } = data;
      const isConflict = await this.isConflictingPromptCategoryName(
         userId,
         undefined,
         name
      );

      if (isConflict) {
         throw new NameConflictError("Kategorie", name);
      }

      await this.repository.pCreatePromptCategory(userId, data);
   }

   async updatePromptCategory(
      userId: string,
      categoryId: number,
      data: DPromptCategoryUpdate
   ): Promise<void> {
      const { name } = data;
      const isConflict = await this.isConflictingPromptCategoryName(
         userId,
         categoryId,
         name
      );

      if (isConflict) {
         throw new NameConflictError("Kategorie", name);
      }

      await this.repository.pUpdatePromptCategory(userId, categoryId, data);
   }

   async deletePromptCategory(
      userId: string,
      categoryId: number
   ): Promise<void> {
      await this.repository.pDeletePromptCategory(userId, categoryId);
   }

   async isConflictingPromptCategoryName(
      userId: string,
      categoryId: number | undefined,
      name: string
   ): Promise<boolean> {
      const trimmedName = trim(name);
      return await this.repository.pPromptCategoryExists(
         userId,
         trimmedName,
         categoryId
      );
   }

   async getPromptModels(userId: string): Promise<string[]> {
      return await this.repository.pGetPromptModels(userId);
   }

   async getPromptModelsPage(
      userId: string,
      query?: DPromptModelsPageQuery
   ): Promise<DPromptModelsPage> {
      return await this.repository.pGetPromptModelsPage(userId, query);
   }

   async getPromptModelsWithUsage(
      userId: string
   ): Promise<DPromptModelWithUsage[]> {
      return await this.repository.pGetPromptModelsWithUsage(userId);
   }

   async createPromptModel(
      userId: string,
      data: DPromptModelUpdate
   ): Promise<void> {
      const { name } = data;
      const isConflict = await this.isConflictingPromptModelName(
         userId,
         undefined,
         name
      );

      if (isConflict) {
         throw new NameConflictError("Modell", name);
      }

      await this.repository.pCreatePromptModel(userId, data);
   }

   async updatePromptModel(
      userId: string,
      modelId: number,
      data: DPromptModelUpdate
   ): Promise<void> {
      const { name } = data;
      const isConflict = await this.isConflictingPromptModelName(
         userId,
         modelId,
         name
      );

      if (isConflict) {
         throw new NameConflictError("Modell", name);
      }

      await this.repository.pUpdatePromptModel(userId, modelId, data);
   }

   async deletePromptModel(userId: string, modelId: number): Promise<void> {
      await this.repository.pDeletePromptModel(userId, modelId);
   }

   async isConflictingPromptModelName(
      userId: string,
      modelId: number | undefined,
      name: string
   ): Promise<boolean> {
      const trimmedName = trim(name);
      return await this.repository.pPromptModelExists(
         userId,
         trimmedName,
         modelId
      );
   }
}
