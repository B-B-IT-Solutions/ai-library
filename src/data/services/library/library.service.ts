import { isEmpty, map } from "es-toolkit/compat";

import {
   GetLibraryEntryParams,
   LibraryRepository,
} from "@/data/repositories/library";
import { PromptTemplateService } from "@/data/services/prompt";
import { OrderProducts } from "@/data/types/db/order";
import {
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
} from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateFieldValues,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export class LibraryService {
   private libraryRepository: LibraryRepository;
   private promptTemplateService: PromptTemplateService;

   constructor(
      libraryRepository: LibraryRepository,
      promptTemplateService: PromptTemplateService
   ) {
      this.libraryRepository = libraryRepository;
      this.promptTemplateService = promptTemplateService;
   }

   async getLibraryEntries(userId: string): Promise<DLibraryEntry[]> {
      return await this.libraryRepository.pGetLibraryEntries(userId);
   }

   async getLibraryEntry(
      entryId: string,
      userId: string
   ): Promise<DLibraryEntryWithPromptTemplate | null> {
      const params: GetLibraryEntryParams = {
         entryId,
         userId,
      };
      return await this.libraryRepository.pGetLibraryEntry(params);
   }

   async createLibraryEntry(data: DPromptTemplateUpdate, userId: string) {
      const ptd =
         await this.promptTemplateService.createPromptTemplateDescriptor(data);

      await this.libraryRepository.pCreateLibraryEntry(userId, ptd.id);
   }

   async createLibraryEntries(order: OrderProducts): Promise<void> {
      for (const item of order.items) {
         const { product } = item;
         const { productItems } = product;
         const templateIds = map(productItems, (i) => i.templateId);

         if (!isEmpty(templateIds)) {
            await this.libraryRepository.pCreateLibraryEntries(
               order.userId,
               templateIds
            );
         }
      }
   }

   async deleteLibraryEntries(userId: string) {
      await this.libraryRepository.pDeleteLibraryEntries(userId);
   }

   async composePromptFromTemplate(
      descriptorId: string,
      fieldValues: DPromptTemplateFieldValues,
      userId: string
   ): Promise<DPromptUpdate> {
      const params: GetLibraryEntryParams = {
         templateDescriptorId: descriptorId,
         userId,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (!entry) {
         throw new Error("Template not found");
      }

      return await this.promptTemplateService.composePromptFromTemplate(
         entry.templateDescriptorId,
         fieldValues
      );
   }

   async downloadPromptTemplate(
      templateDescriptorId: string,
      userId: string
   ): Promise<string> {
      const params: GetLibraryEntryParams = {
         templateDescriptorId,
         userId,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (!entry) {
         throw new Error("Template not found");
      }

      const { templateDescriptor: descriptor } = entry;
      const downloadData = JSON.stringify(
         {
            title: descriptor.title,
            content: descriptor.promptTemplate.content,
            categories: descriptor.categories.map((c) => c.name),
            recommendedModel: descriptor.recommendedModel,
         },
         null,
         2
      );

      return downloadData;
   }
}
