import { isEmpty } from "es-toolkit/compat";

import { PublicTemplateRepository } from "@/data/repositories/prompt";
import {
   DPrompt,
   DPromptGenerationData,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { PublicCollectionService } from "../collection";
import { PublicSettingsService } from "../settings";

import { resolveAllTemplateFields } from "./utils";

export class PublicTemplateService {
   private repository: PublicTemplateRepository;
   private collectionService: PublicCollectionService;
   private settingService: PublicSettingsService;

   constructor(
      repository: PublicTemplateRepository,
      collectionService: PublicCollectionService,
      settingService: PublicSettingsService
   ) {
      this.repository = repository;
      this.collectionService = collectionService;
      this.settingService = settingService;
   }

   async getPublicTemplateDescriptorsPage(
      query: DPromptsPageQuery
   ): Promise<DPromptsPage> {
      const { collectionIds = [] } = query.filter || {};
      if (!isEmpty(collectionIds)) {
         const collectionsPublic =
            await this.collectionService.ensureCollectionsPublic(collectionIds);

         if (collectionsPublic) {
            return await this.repository.pGetPublicTemplateDescriptorsPage(
               query
            );
         }
      }
      throw new Error("Invalid public temmplates query.");
   }

   async getPublicTemplateDataForPromptGeneration(
      teamplateId: string
   ): Promise<DPromptGenerationData | null> {
      const template = await this.getPublicPromptTemplate(teamplateId);

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

   async getPublicTemplateDescriptor(
      descriptorId: string
   ): Promise<DPrompt | null> {
      return await this.repository.pGetPublicTemplateDescriptor(descriptorId);
   }

   async getPublicPromptTemplate(
      templateId: string
   ): Promise<DPromptWithContent | null> {
      return await this.repository.pGetPublicPromptTemplate(templateId);
   }
}
