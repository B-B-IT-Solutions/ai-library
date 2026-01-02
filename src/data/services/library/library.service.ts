import { isEmpty, map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { LibraryRepository } from "@/data/repositories/library";
import { createPrompt as pCreatePrompt } from "@/data/repositories/prompt/prompt";
import { OrderProducts } from "@/data/types/db/order";
import { DLibraryEntry } from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";
import { PromptCreateInput } from "@/generated/prisma/models";
import { formatError } from "../../actions/utils";

import { toDLibraryEntries } from "./library.mapper";

export class LibraryService {
   private libraryRepository: LibraryRepository;

   constructor(libraryRepository: LibraryRepository) {
      this.libraryRepository = libraryRepository;
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

   async copyTemplateToPrompts(
      templateId: string
   ): Promise<ActionResult<void>> {
      try {
         if (!isValidUuid(templateId)) {
            return {
               success: false,
               message: "Invalid template ID.",
            };
         }

         const user = await requireUser();

         // Check access
         const hasAccess = await this.hasAccessToTemplate(templateId);
         if (!hasAccess) {
            return {
               success: false,
               message: "You do not have access to this template.",
            };
         }

         // Get template
         const purchases = await this.libraryRepository.pGetLibraryEntries(
            user.id
         );
         const purchase = purchases.find((p) => p.templateId === templateId);

         if (!purchase) {
            return {
               success: false,
               message: "Template not found.",
            };
         }

         const template = purchase.template;

         // Create prompt from template
         const promptData: PromptCreateInput = {
            title: template.title,
            content: template.content,
            recommendedModel: template.recommendedModel,
            followUpPrompts: [],
            currentVersion: 1,
            isFavorite: false,
            categories: {
               connectOrCreate: template.categories.map((cat) => ({
                  where: { name: cat.name },
                  create: { name: cat.name },
               })),
            },
         };

         await pCreatePrompt(promptData);

         return {
            success: true,
            message: "Template copied to your prompts successfully!",
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }

   async downloadTemplate(templateId: string): Promise<ActionResult<string>> {
      try {
         if (!isValidUuid(templateId)) {
            return {
               success: false,
               message: "Invalid template ID.",
            };
         }

         const user = await requireUser();

         // Check access
         const hasAccess = await this.hasAccessToTemplate(templateId);
         if (!hasAccess) {
            return {
               success: false,
               message: "You do not have access to this template.",
            };
         }

         // Get template
         const purchases = await this.libraryRepository.pGetLibraryEntries(
            user.id
         );
         const purchase = purchases.find((p) => p.templateId === templateId);

         if (!purchase) {
            return {
               success: false,
               message: "Template not found.",
            };
         }

         const template = purchase.template;

         // Create JSON download data
         const downloadData = JSON.stringify(
            {
               title: template.title,
               content: template.content,
               categories: template.categories.map((c) => c.name),
               recommendedModel: template.recommendedModel,
            },
            null,
            2
         );

         return {
            success: true,
            message: "Template ready for download.",
            data: downloadData,
         };
      } catch (error) {
         return {
            success: false,
            message: formatError(error),
         };
      }
   }
}
