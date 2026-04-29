import { isEmpty } from "es-toolkit/compat";

import { PublicTemplateRepository } from "@/data/repositories/template";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { PublicCollectionService } from "../collection";

export class PublicTemplateService {
   private repository: PublicTemplateRepository;
   private collectionService: PublicCollectionService;

   constructor(
      repository: PublicTemplateRepository,
      collectionService: PublicCollectionService
   ) {
      this.repository = repository;
      this.collectionService = collectionService;
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
}
