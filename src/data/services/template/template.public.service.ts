import { isEmpty } from "es-toolkit/compat";

import { PublicTemplateRepository } from "@/data/repositories/template";
import {
   DPromptTemplate,
   DPromptTemplateDataPromptGeneration,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
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
      query: DTemplateDescriptorsPageQuery
   ): Promise<DTemplateDescriptorsPage> {
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
   ): Promise<DPromptTemplateDataPromptGeneration | null> {
      const template = await this.getPublicPromptTemplate(teamplateId);

      if (template) {
         const globalFields =
            await this.settingService.getPublicGlobalTemplateFieldsByIds(
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

   async getPublicPromptTemplate(
      templateId: string
   ): Promise<DPromptTemplate | null> {
      return await this.repository.pGetPublicPromptTemplate(templateId);
   }
}
