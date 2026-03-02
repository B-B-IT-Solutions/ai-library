import { isEmpty, map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithTemplate,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldType,
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptTemplateDescriptorCreateArgs,
   PromptTemplateDescriptorCreateInput,
   PromptTemplateDescriptorUpdateArgs,
   PromptTemplateDescriptorUpdateInput,
   PromptTemplateDescriptorWhereInput,
} from "@/generated/prisma/models";

import {
   toDPromptTemplate,
   toDPromptTemplateDescriptor,
   toDPromptTemplateDescriptors,
   toDPromptTemplateDescriptorWithTemplate,
} from "./prompt.template.mapper";

type PGetPromptTemplateDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export class PromptTemplateRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPromptTemplateDescriptors(
      params?: PGetPromptTemplateDescriptorsParams
   ) {
      const where = this.resolveGetPromptTemplateDescriptorsWhereInput(params);

      const templates = await this.prisma.promptTemplateDescriptor.findMany({
         where: where,
         include: {
            categories: true,
         },
         take: 20,
      });

      return toDPromptTemplateDescriptors(templates);
   }

   async pGetPromptTemplateDescriptorWithTemplate(
      id: string
   ): Promise<DPromptTemplateDescriptorWithTemplate | null> {
      const template: PromptTemplateDescriptorWithTemplate | null =
         await this.prisma.promptTemplateDescriptor.findFirst({
            where: { id },
            include: {
               categories: true,
               promptTemplate: {
                  include: {
                     fields: true,
                     globalFields: true,
                  },
               },
            },
         });

      if (template) {
         return toDPromptTemplateDescriptorWithTemplate(template);
      }
      return null;
   }

   async pGetPromptTemplate(id: string): Promise<DPromptTemplate | null> {
      const template = await this.prisma.promptTemplate.findFirst({
         where: { id },
         include: {
            fields: true,
            globalFields: true,
         },
      });

      return template ? toDPromptTemplate(template) : null;
   }

   async pGetPromptTemplateCategories(): Promise<DPromptTemplateCategory[]> {
      return await this.prisma.promptTemplateCategory.findMany({
         select: {
            name: true,
         },
      });
   }

   async pCreatePromptTemplateDescriptor(
      data: DPromptTemplateUpdate
   ): Promise<DPromptTemplateDescriptor> {
      const input: PromptTemplateDescriptorCreateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            connectOrCreate: map(data.categories, (categoryName) => ({
               where: {
                  name: categoryName,
               },
               create: {
                  name: categoryName,
               },
            })),
         },
         promptTemplate: {
            create: {
               content: data.content,
               detailedDescription: data.detailedDescription,
               fields: {
                  create: map(
                     data.fields,
                     (field: DPromptTemplateFieldUpdate) => ({
                        name: field.name,
                        label: field.label,
                        description: field.description,
                        type: field.type as DPromptTemplateFieldType,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: field.options,
                     })
                  ),
               },
               globalFields: {
                  create: map(data.globalFieldIds, (id, idx) => ({
                     globalFieldId: id,
                     order: idx,
                  })),
               },
            },
         },
      };

      const args: PromptTemplateDescriptorCreateArgs = {
         data: input,
         include: {
            categories: true,
         },
      };
      const newEntry = await this.prisma.promptTemplateDescriptor.create(args);
      return toDPromptTemplateDescriptor(
         newEntry as PromptTemplateDescriptorWithCategories
      );
   }

   async pUpdatePromptTemplateDescriptor(
      descriptorId: string,
      data: DPromptTemplateUpdate
   ) {
      const input: PromptTemplateDescriptorUpdateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            set: [],
            connectOrCreate: map(data.categories, (categoryName) => ({
               where: { name: categoryName },
               create: { name: categoryName },
            })),
         },
         promptTemplate: {
            update: {
               content: data.content,
               detailedDescription: data.detailedDescription,
               fields: {
                  deleteMany: {},
                  create: map(
                     data.fields,
                     (field: DPromptTemplateFieldUpdate) => ({
                        name: field.name,
                        label: field.label,
                        description: field.description,
                        type: field.type as DPromptTemplateFieldType,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: field.options,
                     })
                  ),
               },
               globalFields: {
                  deleteMany: {},
                  create: map(data.globalFieldIds, (id, idx) => ({
                     globalFieldId: id,
                     order: idx,
                  })),
               },
            },
         },
      };

      const args: PromptTemplateDescriptorUpdateArgs = {
         where: { id: descriptorId },
         data: input,
      };

      await this.prisma.promptTemplateDescriptor.update(args);
   }

   private resolveGetPromptTemplateDescriptorsWhereInput(
      params?: PGetPromptTemplateDescriptorsParams
   ): PromptTemplateDescriptorWhereInput | undefined {
      if (isEmpty(params)) {
         return undefined;
      }

      const { search, categories } = params;

      const searchClause:
         | Prisma.PromptTemplateDescriptorWhereInput[]
         | undefined = search
         ? [
              {
                 title: {
                    contains: search,
                    mode: "insensitive",
                 },
              },
              {
                 promptTemplate: {
                    content: {
                       contains: search,
                       mode: "insensitive",
                    },
                 },
              },
           ]
         : undefined;

      const isCategories = !isEmpty(categories);
      const categoriesClause:
         | Prisma.PromptTemplateDescriptorWhereInput[]
         | undefined = isCategories
         ? [
              {
                 categories: {
                    some: {
                       name: {
                          in: categories,
                       },
                    },
                 },
              },
           ]
         : undefined;

      return {
         OR: searchClause,
         AND: categoriesClause,
      };
   }
}
