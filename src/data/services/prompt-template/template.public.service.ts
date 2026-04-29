import { isEmpty } from "es-toolkit/compat";

import { PublicTemplateRepository } from "@/data/repositories/prompt-template";
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
         this.collectionService.ensureCollectionsPublic(collectionIds);
         return await this.repository.pGetPublicTemplateDescriptorsPage(query);
      }
      throw new Error("Invalid public temmplates query.");
   }
}
