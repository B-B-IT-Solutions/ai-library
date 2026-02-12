import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   LibraryEntryWithPromptTemplate,
   LibraryEntryWithPromptTemplateDescriptor,
} from "@/data/types/db/library";
import {
   LibraryEntryCreateArgs,
   LibraryEntryCreateManyArgs,
   LibraryEntryCreateManyInput,
   LibraryEntryWhereUniqueInput,
} from "@/generated/prisma/models";

export type GetLibraryEntryParams = {
   userId: string;
} & (
   | { entryId: string; templateDescriptorId?: never }
   | { templateDescriptorId: string; entryId?: never }
);

export class LibraryRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetLibraryEntries(
      userId: string
   ): Promise<LibraryEntryWithPromptTemplateDescriptor[]> {
      return await this.prisma.libraryEntry.findMany({
         where: { userId },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      });
   }

   async pGetLibraryEntry(
      params: GetLibraryEntryParams
   ): Promise<LibraryEntryWithPromptTemplate | null> {
      const where = this.getLibraryEntryParamsToWhereFindUniqueInput(params);
      return await this.prisma.libraryEntry.findUnique({
         where: where,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
                  promptTemplate: {
                     include: {
                        fields: true,
                     },
                  },
               },
            },
         },
      });
   }

   async pCreateLibraryEntries(
      userId: string,
      templateDescriptorIds: string[]
   ) {
      const entries = map(templateDescriptorIds, (templateDescriptorId) => {
         const entry: LibraryEntryCreateManyInput = {
            userId,
            templateDescriptorId,
         };
         return entry;
      });

      const args: LibraryEntryCreateManyArgs = {
         data: entries,
         skipDuplicates: true,
      };

      await this.prisma.libraryEntry.createMany(args);
   }

   async pDeleteLibraryEntries(userId: string) {
      return await this.prisma.libraryEntry.deleteMany({
         where: { userId },
      });
   }

   async pCreateCustomLibraryEntry(data: {
      userId: string;
      promptTemplate: {
         content: string;
         detailedDescription: string;
         fields: Array<{
            name: string;
            label: string;
            description?: string;
            type: string;
            required: boolean;
            order: number;
            defaultValue?: string;
            options?: string[];
         }>;
      };
      templateDescriptor: {
         title: string;
         description: string;
         recommendedModel: string;
         categories: string[];
      };
   }) {
      const args: LibraryEntryCreateArgs = {
         data: {
            templateDescriptor: {
               create: {
                  title: data.templateDescriptor.title,
                  description: data.templateDescriptor.description,
                  recommendedModel: data.templateDescriptor.recommendedModel,
                  categories: {
                     connectOrCreate: data.templateDescriptor.categories.map(
                        (categoryName) => ({
                           where: { name: categoryName },
                           create: { name: categoryName },
                        })
                     ),
                  },
                  promptTemplate: {
                     create: {
                        content: data.promptTemplate.content,
                        detailedDescription:
                           data.promptTemplate.detailedDescription,
                        fields: {
                           create: data.promptTemplate.fields.map((field) => ({
                              name: field.name,
                              label: field.label,
                              description: field.description,
                              type: field.type,
                              required: field.required,
                              order: field.order,
                              defaultValue: field.defaultValue,
                              options: field.options
                                 ? JSON.stringify(field.options)
                                 : undefined,
                           })),
                        },
                     },
                  },
               },
            },
            user: {
               connect: {
                  id: data.userId,
               },
            },
         },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
                  promptTemplate: {
                     include: {
                        fields: true,
                     },
                  },
               },
            },
         },
      };

      return await this.prisma.libraryEntry.create(args);
   }

   private getLibraryEntryParamsToWhereFindUniqueInput = (
      params: GetLibraryEntryParams
   ): LibraryEntryWhereUniqueInput => {
      const { userId, entryId, templateDescriptorId } = params;

      if (entryId) {
         return {
            id: entryId,
            userId,
         };
      }

      return {
         userId_templateDescriptorId: {
            userId,
            templateDescriptorId: templateDescriptorId as string,
         },
      };
   };
}
