import { filter, isEmpty, map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { Prompt0sPage, Prompt0WithRelations } from "@/data/types/db/prompt0";
import {
   DPrompt0,
   DPrompt0Category,
   DPrompt0FollowUpUpdate,
   DPrompt0sPage,
   DPrompt0sPageQuery,
   DPrompt0Update,
} from "@/data/types/domain/prompt0";
import {
   Prompt0CategoryCreateOrConnectWithoutPromptsInput,
   Prompt0CreateInput,
   Prompt0DeleteArgs,
   Prompt0FollowUpCreateWithoutPromptInput,
   Prompt0FollowUpScalarWhereInput,
   Prompt0FollowUpUpdateManyWithoutPromptNestedInput,
   Prompt0FollowUpUpdateWithWhereUniqueWithoutPromptInput,
   Prompt0UpdateInput,
   Prompt0WhereInput,
} from "@/generated/prisma/models";
import { DEFAULT_PAGINATION } from "../utils";

import { toDPromptDescriptor, toDPromptDescriptorsPage } from "./prompt.mapper";

export class PromptRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPromptDescriptors(
      userId: string,
      query?: DPrompt0sPageQuery
   ): Promise<DPrompt0sPage> {
      const { pagination } = query || {};
      const { pageNumber, pageSize } = pagination || DEFAULT_PAGINATION;

      const whereClause = this.resolveGetPromptDescriptorsWhereInput(
         userId,
         query
      );

      const [data, count] = await Promise.all([
         this.prisma.prompt0.findMany({
            where: whereClause,
            skip: pageNumber * pageSize,
            take: pageSize,
            include: {
               categories: true,
            },
            orderBy: { updatedAt: "desc" },
         }),
         this.prisma.prompt0.count({
            where: whereClause,
         }),
      ]);

      const dbResult: Prompt0sPage = {
         content: data as Prompt0WithRelations[],
         numberOfElements: data.length,
         pageNumber: pageNumber,
         pageSize: pageSize,
         totalElements: count,
         totalPages: Math.ceil(count / pageSize),
      };
      return toDPromptDescriptorsPage(dbResult);
   }

   async pGetPromptDescriptor(
      userId: string,
      promptId: string
   ): Promise<DPrompt0 | null> {
      const data: Prompt0WithRelations | null =
         await this.prisma.prompt0.findFirst({
            where: { id: promptId, userId },
            include: {
               categories: true,
               versions: {
                  orderBy: { version: "desc" },
               },
               followUpPrompts: {
                  orderBy: { order: "asc" },
               },
            },
         });

      if (data) {
         return toDPromptDescriptor(data);
      }
      return null;
   }

   async pGetPromptCategories(userId: string): Promise<DPrompt0Category[]> {
      return await this.prisma.prompt0Category.findMany({
         where: { userId },
         select: {
            name: true,
         },
      });
   }

   async pCreatePrompt(userId: string, data: DPrompt0Update) {
      const categories = this.createOrConnectCategories(
         userId,
         data.categories
      );
      const followUps = this.createFollowUpsInput(data.followUpPrompts);

      const toSave: Prompt0CreateInput = {
         title: data.title,
         content: data.content,
         recommendedModel: data.recommendedModel,
         currentVersion: 0,
         categories: {
            connectOrCreate: categories,
         },
         followUpPrompts: {
            create: followUps,
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };

      return await this.prisma.prompt0.create({
         data: toSave,
      });
   }

   async pUpdatePrompt(
      userId: string,
      promptId: string,
      data: DPrompt0Update,
      current: DPrompt0,
      versionIdx: number,
      updateVersions: boolean
   ) {
      const versions = updateVersions
         ? {
              create: {
                 version: versionIdx,
                 content: data.content,
              },
           }
         : undefined;

      const categories = this.createOrConnectCategories(
         userId,
         data.categories
      );
      const followUpPrompts = this.followUpPromptUpdates(current, data);

      const toSave: Prompt0UpdateInput = {
         title: data.title,
         content: data.content,
         recommendedModel: data.recommendedModel,
         currentVersion: versionIdx,
         categories: {
            set: [],
            connectOrCreate: categories,
         },
         followUpPrompts,
         versions,
      };

      return await this.prisma.prompt0.update({
         where: { id: promptId, userId },
         data: toSave,
      });
   }

   async pToggleFavorite(
      userId: string,
      promptId: string,
      isFavorite: boolean
   ) {
      await this.prisma.prompt0.update({
         where: { id: promptId, userId },
         data: { isFavorite },
      });
   }

   async pDeletePrompt(userId: string, promptId: string) {
      const args: Prompt0DeleteArgs = {
         where: { id: promptId, userId },
      };
      await this.prisma.prompt0.delete(args);
   }

   followUpPromptUpdates(
      current: DPrompt0,
      promptUpdate: DPrompt0Update
   ): Prompt0FollowUpUpdateManyWithoutPromptNestedInput {
      const existingIds = new Set(map(current.followUpPrompts, (f) => f.id));
      const followUpsWithoutId = filter(
         promptUpdate.followUpPrompts,
         (f) => !f.id
      );
      const followUpsWithId = filter(
         promptUpdate.followUpPrompts,
         (f) => !!f.id
      );
      const updatedIds = new Set(map(followUpsWithId, (f) => f.id!));
      const idsToDelete = filter([...existingIds], (id) => !updatedIds.has(id));

      const update = isEmpty(followUpsWithId)
         ? undefined
         : this.updateFollowUpsInput(followUpsWithId);

      const create = isEmpty(followUpsWithoutId)
         ? undefined
         : this.createFollowUpsInput(followUpsWithoutId);

      const deleteMany = isEmpty(idsToDelete)
         ? undefined
         : this.deleteFollowUpsInput(idsToDelete);

      return {
         update,
         create,
         deleteMany,
      };
   }

   private createOrConnectCategories(
      userId: string,
      categories: string[]
   ): Prompt0CategoryCreateOrConnectWithoutPromptsInput[] {
      return map(categories, (cat: string) => {
         return {
            where: {
               userId_name: { userId, name: cat },
            },
            create: {
               name: cat,
               userId,
            },
         };
      });
   }

   private createFollowUpsInput(
      followUpPrompts: DPrompt0FollowUpUpdate[]
   ): Prompt0FollowUpCreateWithoutPromptInput[] {
      return map(followUpPrompts, (f) => ({
         content: f.content,
         order: f.order,
      }));
   }

   private updateFollowUpsInput(
      followUpPrompts: DPrompt0FollowUpUpdate[]
   ): Prompt0FollowUpUpdateWithWhereUniqueWithoutPromptInput[] {
      return map(followUpPrompts, (f) => ({
         where: { id: f.id! },
         data: { content: f.content, order: f.order },
      }));
   }

   private deleteFollowUpsInput(
      followUpPromptIds: string[]
   ): Prompt0FollowUpScalarWhereInput {
      return {
         id: {
            in: followUpPromptIds,
         },
      };
   }

   private resolveGetPromptDescriptorsWhereInput(
      userId: string,
      query?: DPrompt0sPageQuery
   ): Prompt0WhereInput | undefined {
      const { globalFilter, filter } = query || {};
      const { categories, isFavorite } = filter || {};

      const searchClause: Prompt0WhereInput[] | undefined = globalFilter
         ? [
              {
                 title: {
                    contains: globalFilter,
                    mode: "insensitive",
                 },
              },
              {
                 content: {
                    contains: globalFilter,
                    mode: "insensitive",
                 },
              },
           ]
         : undefined;

      const isCategories = !isEmpty(categories);
      const categoriesClause: Prompt0WhereInput[] | undefined = isCategories
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

      const favoriteClause =
         isFavorite !== undefined ? { isFavorite } : undefined;

      return {
         userId,
         OR: searchClause,
         AND: categoriesClause,
         ...favoriteClause,
      };
   }
}
