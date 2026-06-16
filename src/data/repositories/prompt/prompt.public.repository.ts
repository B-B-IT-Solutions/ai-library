import { DbClient } from "@/data/types/db/common";
import {
   PromptWithCategories,
   PromptWithContent,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import {
   PromptCountArgs,
   PromptFindFirstArgs,
   PromptFindManyArgs,
} from "@/generated/prisma/models";

import { toDPrompt, toDPrompts, toDPromptWithContent } from "./prompt.mapper";
import { resolveOrderBy, resolveWhereInput } from "./utils";

export class PublicPromptRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPublicPromptsPage(
      query: DPromptsPageQuery
   ): Promise<DPromptsPage> {
      const pagination = query.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolveWhereInput(undefined, query.filter);
      const orderBy = resolveOrderBy(query.sort);

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
         content: toDPrompts(descriptors),
         pageNumber,
         pageSize,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPublicPrompt(promptId: string): Promise<DPrompt | null> {
      const args = {
         where: { id: promptId },
         include: {
            categories: true,
         },
      } satisfies PromptFindFirstArgs;

      const descriptor: PromptWithCategories | null =
         await this.prisma.prompt.findFirst(args);

      return descriptor ? toDPrompt(descriptor) : null;
   }

   async pGetPublicPromptContent(
      promptId: string
   ): Promise<DPromptWithContent | null> {
      const args = {
         where: { id: promptId },
         include: {
            content: true,
            categories: true,
            fields: true,
            globalFields: true,
         },
      } satisfies PromptFindFirstArgs;

      const prompt = await this.prisma.prompt.findFirst(args);

      return prompt ? toDPromptWithContent(prompt as PromptWithContent) : null;
   }
}
