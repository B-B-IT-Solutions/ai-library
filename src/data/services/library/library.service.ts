import { isEmpty, map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { LibraryRepository } from "@/data/repositories/library";
import { PromptService } from "@/data/services/prompt";
import { OrderProducts } from "@/data/types/db/order";
import { DLibraryEntry } from "@/data/types/domain/library";
import { DPromptCreate } from "@/data/types/domain/prompt";

import { toDLibraryEntries } from "./library.mapper";

export class LibraryService {
   private libraryRepository: LibraryRepository;
   private promptService: PromptService;

   constructor(
      libraryRepository: LibraryRepository,
      promptService: PromptService
   ) {
      this.libraryRepository = libraryRepository;
      this.promptService = promptService;
   }

   async getLibraryEntries(): Promise<DLibraryEntry[]> {
      try {
         const user = await requireUser();
         const entries = await this.libraryRepository.pGetLibraryEntries(
            user.id!
         );
         return toDLibraryEntries(entries);
      } catch {
         return [];
      }
   }

   async getLibraryEntryByTemplateId(
      templateId: string
   ): Promise<DLibraryEntry | null> {
      const user = await requireUser();
      const entries = await this.libraryRepository.pGetLibraryEntries(user.id);
      const entry = entries.find((e) => e.templateId === templateId);

      if (!entry) {
         return null;
      }

      return toDLibraryEntries([entry])[0];
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

   async hasAccessToTemplate(templateId: string): Promise<boolean> {
      try {
         const user = await requireUser();
         return await this.libraryRepository.pCheckUserHasTemplate(
            user.id,
            templateId
         );
      } catch {
         return false;
      }
   }

   async createPromptFromTemplate(templateId: string) {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid template ID.");
      }

      const user = await requireUser();

      // Check access
      const hasAccess = await this.hasAccessToTemplate(templateId);
      if (!hasAccess) {
         throw new Error("You do not have access to this template.");
      }

      // Get template
      const purchases = await this.libraryRepository.pGetLibraryEntries(
         user.id
      );
      const purchase = purchases.find((p) => p.templateId === templateId);

      if (!purchase) {
         throw new Error("Template not found");
      }

      const template = purchase.template;

      // Create prompt from template
      const promptData: DPromptCreate = {
         content: template.promptText || "",
         title: template.title,
         recommendedModel: template.recommendedModel,
         categories: map(template.categories, (cat) => cat.name),
      };

      await this.promptService.createPrompt(promptData);
   }

   async downloadTemplate(templateId: string): Promise<string> {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid template ID.");
      }

      const user = await requireUser();

      // Check access
      const hasAccess = await this.hasAccessToTemplate(templateId);
      if (!hasAccess) {
         throw new Error("You do not have access to this template.");
      }

      // Get template
      const purchases = await this.libraryRepository.pGetLibraryEntries(
         user.id
      );
      const purchase = purchases.find((p) => p.templateId === templateId);

      if (!purchase) {
         throw new Error("Template not found.");
      }

      const template = purchase.template;

      // Create JSON download data
      const downloadData = JSON.stringify(
         {
            title: template.title,
            content: template.promptText || "",
            categories: template.categories.map((c) => c.name),
            recommendedModel: template.recommendedModel,
         },
         null,
         2
      );

      return downloadData;
   }
}
