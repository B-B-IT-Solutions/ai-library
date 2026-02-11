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
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

import {
   toDLibraryEntries,
   toDLibraryEntryWithPromptTemplate,
} from "./library.mapper";

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
      try {
         const entries =
            await this.libraryRepository.pGetLibraryEntries(userId);
         return toDLibraryEntries(entries);
      } catch {
         return [];
      }
   }

   async getLibraryEntry(
      entryId: string,
      userId: string
   ): Promise<DLibraryEntryWithPromptTemplate | null> {
      const params: GetLibraryEntryParams = {
         entryId,
         userId,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (entry) {
         return toDLibraryEntryWithPromptTemplate(entry);
      }
      return null;
   }

   async createLibraryEntries(order: OrderProducts): Promise<void> {
      for (const item of order.items) {
         const { product } = item;
         const { productItems } = product;
         const templateIds = map(productItems, (i) => i.templateId);

         if (!isEmpty(templateIds)) {
            await this.libraryRepository.pCreateLibraryEntries(
               order.id,
               order.userId,
               product.id,
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
