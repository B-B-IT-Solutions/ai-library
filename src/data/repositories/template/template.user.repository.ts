import { flatMap, isEmpty, map, uniq } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { PromptWithCategories, PromptWithFieldsAndContent } from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptCategory,
   DPromptContent,
   DPromptFieldType,
   DPromptFieldUpdate,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptUpdate,
} from "@/data/types/domain/prompt";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptCountArgs,
   PromptCreateArgs,
   PromptCreateInput,
   PromptDeleteArgs,
   PromptFindManyArgs,
   PromptUpdateArgs,
   PromptUpdateInput,
   PromptWhereInput,
} from "@/generated/prisma/models";

import {
   toDPromptTemplate,
   toDTemplateDescriptor,
   toDTemplateDescriptors,
} from "./template.mapper";
import { resolveOrderBy, resolveWhereInput } from "./utils";

type PGetPromptsParams = {
   search?: string;
   categories?: string[];
};

export class TemplateRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetTemplateDescriptorsPage(
      userId: string,
      query?: DPromptsPageQuery
   ): Promise<DPromptsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolveWhereInput(userId, query?.filter);
      const orderBy = resolveOrderBy(query?.sort);

      const args: PromptFindManyArgs = {
         where,
         include: {
            categories: true,
         },
         orderBy,
         skip,
         take: pageSize,
      };

      const countArgs: PromptCountArgs = {
         where,
      };

      const [descriptors, totalElements] = await Promise.all([
         this.prisma.prompt.findMany(args) as Promise<PromptWithCategories[]>,
         this.prisma.prompt.count(countArgs),
      ]);

      return {
         content: toDTemplateDescriptors(descriptors),
         pageNumber,
         pageSize,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPrompts(params?: PGetPromptsParams) {
      const where = this.resolveGetPromptsWhereInput(params);

      const templates = await this.prisma.prompt.findMany({
         where: where,
         include: {
            categories: true,
         },
         take: 20,
      });

      return toDTemplateDescriptors(templates);
   }

   async pGetTemplateDescriptor(
      userId: string,
      id: string
   ): Promise<DPrompt | null> {
      const template: PromptWithCategories | null =
         await this.prisma.prompt.findFirst({
            where: { id, userId },
            include: {
               categories: true,
            },
         });

      if (template) {
         return toDTemplateDescriptor(template);
      }
      return null;
   }

   async pGetPromptTemplate(
      userId: string,
      id: string
   ): Promise<DPromptContent | null> {
      const prompt = await this.prisma.prompt.findFirst({
         where: { id, userId },
         include: {
            promptContent: true,
            fields: true,
            globalFields: true,
         },
      });

      return prompt ? toDPromptTemplate(prompt as PromptWithFieldsAndContent) : null;
   }

   async pGetPromptTemplateCategories(
      userId: string
   ): Promise<DPromptCategory[]> {
      return await this.prisma.promptCategory.findMany({
         where: { userId },
         select: {
            name: true,
         },
      });
   }

   async pCreatePrompt(userId: string, data: DPromptUpdate): Promise<DPrompt> {
      const input: PromptCreateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            connectOrCreate: map(data.categories, (catName) => ({
               where: {
                  userId_name: { userId, name: catName },
               },
               create: {
                  name: catName,
                  userId,
               },
            })),
         },
         promptContent: {
            create: {
               content: data.content,
            },
         },
         fields: {
            create: map(data.fields, (field: DPromptFieldUpdate) => ({
               name: field.name,
               label: field.label,
               description: field.description,
               type: field.type as DPromptFieldType,
               required: field.required,
               order: field.order,
               defaultValue: field.defaultValue,
               options: field.options,
            })),
         },
         globalFields: {
            create: map(data.globalFieldIds, (id, idx) => ({
               globalFieldId: id,
               order: idx,
            })),
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const args: PromptCreateArgs = {
         data: input,
         include: {
            categories: true,
         },
      };
      const newEntry = await this.prisma.prompt.create(args);
      return toDTemplateDescriptor(newEntry as PromptWithCategories);
   }

   async pUpdatePrompt(
      userId: string,
      descriptorId: string,
      data: DPromptUpdate
   ) {
      const input: PromptUpdateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            set: [],
            connectOrCreate: map(data.categories, (catName) => ({
               where: { userId_name: { userId, name: catName } },
               create: { name: catName, userId },
            })),
         },
         promptContent: {
            update: {
               content: data.content,
            },
         },
         fields: {
            deleteMany: {},
            create: map(data.fields, (field: DPromptFieldUpdate) => ({
               name: field.name,
               label: field.label,
               description: field.description,
               type: field.type as DPromptFieldType,
               required: field.required,
               order: field.order,
               defaultValue: field.defaultValue,
               options: field.options,
            })),
         },
         globalFields: {
            deleteMany: {},
            create: map(data.globalFieldIds, (id, idx) => ({
               globalFieldId: id,
               order: idx,
            })),
         },
      };

      const args: PromptUpdateArgs = {
         where: { id: descriptorId },
         data: input,
      };

      await this.prisma.prompt.update(args);
   }

   async pDeletePrompt(userId: string, descriptorId: string) {
      const args: PromptDeleteArgs = {
         where: { id: descriptorId, userId },
      };
      await this.prisma.prompt.delete(args);
   }

   async pToggleFavorite(
      userId: string,
      descriptorId: string,
      isFavorite: boolean
   ): Promise<void> {
      const input: PromptUpdateInput = { isFavorite };

      const args: PromptUpdateArgs = {
         where: {
            id: descriptorId,
            userId,
         },
         data: input,
      };

      await this.prisma.prompt.update(args);
   }

   async pGetTemplateCategories(userId: string): Promise<string[]> {
      const descriptors = await this.prisma.prompt.findMany({
         where: { userId },
         include: {
            categories: true,
         },
      });

      const categories = flatMap(descriptors, (d) =>
         map(d.categories, (cat) => cat.name)
      );
      return uniq(categories).sort();
   }

   async pGetTemplateModels(userId: string): Promise<string[]> {
      const descriptors = await this.prisma.prompt.findMany({
         where: { userId },
         select: {
            recommendedModel: true,
         },
      });

      const models = map(descriptors, (d) => d.recommendedModel);
      return uniq(models).sort();
   }

   private resolveGetPromptsWhereInput(
      params?: PGetPromptsParams
   ): PromptWhereInput | undefined {
      if (isEmpty(params)) {
         return undefined;
      }

      const { search, categories } = params;

      const searchClause: Prisma.PromptWhereInput[] | undefined = search
         ? [
              {
                 title: {
                    contains: search,
                    mode: "insensitive",
                 },
              },
              {
                 promptContent: {
                    content: {
                       contains: search,
                       mode: "insensitive",
                    },
                 },
              },
           ]
         : undefined;

      const isCategories = !isEmpty(categories);
      const categoriesClause: Prisma.PromptWhereInput[] | undefined =
         isCategories
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
