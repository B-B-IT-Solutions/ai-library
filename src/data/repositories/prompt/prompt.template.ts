import { isEmpty, map } from "es-toolkit/compat";

import { toDPromptTemplateDescriptor } from "@/data/services/prompt/prompt.template.mapper";
import { DbClient } from "@/data/types/db/common";
import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithTemplate,
   PromptTemplateWithFields,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplateDescriptor,
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptTemplateDescriptorCreateArgs,
   PromptTemplateDescriptorCreateInput,
   PromptTemplateDescriptorWhereInput,
} from "@/generated/prisma/models";
import { stringify } from "@/lib/utils";

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
      return await this.prisma.promptTemplateDescriptor.findMany({
         where: where,
         include: {
            categories: true,
         },
         take: 20,
      });
   }

   async pGetPromptTemplateDescriptorWithTemplate(
      id: string
   ): Promise<PromptTemplateDescriptorWithTemplate | null> {
      return await this.prisma.promptTemplateDescriptor.findFirst({
         where: { id },
         include: {
            categories: true,
            promptTemplate: {
               include: {
                  fields: true,
               },
            },
         },
      });
   }

   async pGetPromptTemplate(
      id: string
   ): Promise<PromptTemplateWithFields | null> {
      return await this.prisma.promptTemplate.findFirst({
         where: { id },
         include: {
            fields: true,
         },
      });
   }

   async pGetPromptTemplateCategories() {
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
            connectOrCreate: map(data.categories, (categoryName: string) => ({
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
                        type: field.type,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: stringify(field.options),
                     })
                  ),
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
