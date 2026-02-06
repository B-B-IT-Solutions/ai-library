import { isEmpty, map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import {
   GetLibraryEntryParams,
   LibraryRepository,
} from "@/data/repositories/library";
import { PromptService, PromptTemplateService } from "@/data/services/prompt";
import { toDPromptTemplateDescriptorWithTemplate } from "@/data/services/prompt/prompt.template.mapper";
import { TemplateEngine } from "@/data/services/template/template.engine";
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
   private promptService: PromptService;
   private promptTemplateService: PromptTemplateService;

   constructor(
      libraryRepository: LibraryRepository,
      promptService: PromptService,
      promptTemplateService: PromptTemplateService
   ) {
      this.libraryRepository = libraryRepository;
      this.promptService = promptService;
      this.promptTemplateService = promptTemplateService;
   }

   async getLibraryEntries(): Promise<DLibraryEntry[]> {
      try {
         const user = await requireUser();
         const entries = await this.libraryRepository.pGetLibraryEntries(
            user.id
         );
         return toDLibraryEntries(entries);
      } catch {
         return [];
      }
   }

   async getLibraryEntry(
      entryId: string
   ): Promise<DLibraryEntryWithPromptTemplate | null> {
      const user = await requireUser();
      const params: GetLibraryEntryParams = { entryId, userId: user.id };
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

   async createPromptFromTemplate(templateDescriptorId: string) {
      if (!isValidUuid(templateDescriptorId)) {
         throw new Error("Invalid template ID.");
      }
      const user = await requireUser();

      const params: GetLibraryEntryParams = {
         templateDescriptorId,
         userId: user.id,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (!entry) {
         throw new Error("Template not found");
      }

      const { templateDescriptor: descriptor } = entry;
      const promptData: DPromptUpdate = {
         content: descriptor.promptTemplate.promptText,
         title: descriptor.title,
         recommendedModel: descriptor.recommendedModel,
         categories: map(descriptor.categories, (cat) => cat.name),
         followUpPrompts: [],
      };

      await this.promptService.createPrompt(promptData);
   }

   async generatePromptFromTemplate(
      templateDescriptorId: string,
      fieldValues: DPromptTemplateFieldValues
   ): Promise<DPromptUpdate> {
      if (!isValidUuid(templateDescriptorId)) {
         throw new Error("Invalid template ID.");
      }

      const user = await requireUser();

      const params: GetLibraryEntryParams = {
         templateDescriptorId,
         userId: user.id,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (!entry) {
         throw new Error("Template nicht in Ihrer Bibliothek gefunden");
      }

      const descriptor = toDPromptTemplateDescriptorWithTemplate(
         entry.templateDescriptor
      );
      const template = descriptor.promptTemplate;

      // Validate field values
      const validation = TemplateEngine.validate(template.fields, fieldValues);
      if (!validation.valid) {
         throw new Error(
            `Validierungsfehler: ${JSON.stringify(validation.errors)}`
         );
      }

      // Render template with values
      const renderedContent = TemplateEngine.replace(
         template.promptText,
         fieldValues
      );

      return {
         content: renderedContent,
         title: descriptor.title,
         recommendedModel: descriptor.recommendedModel,
         categories: descriptor.categories.map((cat) => cat.name),
         followUpPrompts: [],
      };
   }

   async downloadPromptTemplate(templateDescriptorId: string): Promise<string> {
      if (!isValidUuid(templateDescriptorId)) {
         throw new Error("Invalid template ID.");
      }

      const user = await requireUser();

      const params: GetLibraryEntryParams = {
         templateDescriptorId,
         userId: user.id,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (!entry) {
         throw new Error("Template not found");
      }

      const { templateDescriptor: descriptor } = entry;
      const downloadData = JSON.stringify(
         {
            title: descriptor.title,
            content: descriptor.promptTemplate.promptText,
            categories: descriptor.categories.map((c) => c.name),
            recommendedModel: descriptor.recommendedModel,
         },
         null,
         2
      );

      return downloadData;
   }
}
