import { isEmpty } from "es-toolkit/compat";

import { PublicPromptRepository } from "@/data/repositories/prompt";
import {
   DPrompt,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptTemplatingData,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { PublicCollectionService } from "../collection";
import { PublicSettingsService } from "../settings";

import { resolveAllTemplateFields } from "./utils";

export class PublicPromptService {
   private repository: PublicPromptRepository;
   private collectionService: PublicCollectionService;
   private settingService: PublicSettingsService;

   constructor(
      repository: PublicPromptRepository,
      collectionService: PublicCollectionService,
      settingService: PublicSettingsService
   ) {
      this.repository = repository;
      this.collectionService = collectionService;
      this.settingService = settingService;
   }

   async getPublicPromptsPage(query: DPromptsPageQuery): Promise<DPromptsPage> {
      const { collectionIds = [] } = query.filter || {};
      if (!isEmpty(collectionIds)) {
         const collectionsPublic =
            await this.collectionService.ensureCollectionsPublic(collectionIds);

         if (collectionsPublic) {
            return await this.repository.pGetPublicPromptsPage(query);
         }
      }
      throw new Error("Invalid public temmplates query.");
   }

   async getPublicPromptGenerationData(
      teamplateId: string
   ): Promise<DPromptTemplatingData | null> {
      const template = await this.getPublicPromptContent(teamplateId);

      if (template) {
         const globalFields =
            await this.settingService.getPublicGlobalPromptFieldsByIds(
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

   async getPublicPrompt(promptId: string): Promise<DPrompt | null> {
      return await this.repository.pGetPublicPrompt(promptId);
   }

   async getPublicPromptContent(
      promptId: string
   ): Promise<DPromptWithContent | null> {
      return await this.repository.pGetPublicPromptContent(promptId);
   }
}
