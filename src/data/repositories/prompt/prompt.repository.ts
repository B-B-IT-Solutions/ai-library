import { filter, isEmpty, map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   PromptDescriptorsPage,
   PromptDescriptorWithRelations,
} from "@/data/types/db/prompt";
import {
   DPromptCategory,
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
   DPromptFollowUpUpdate,
   DPromptUpdate,
} from "@/data/types/domain/prompt";
import {
   PromptCategoryCreateOrConnectWithoutPromptsInput,
   PromptDescriptorCreateInput,
   PromptDescriptorUpdateInput,
   PromptDescriptorWhereInput,
   PromptFollowUpCreateWithoutPromptInput,
   PromptFollowUpScalarWhereInput,
   PromptFollowUpUpdateManyWithoutPromptNestedInput,
   PromptFollowUpUpdateWithWhereUniqueWithoutPromptInput,
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
      query?: DPromptDescriptorsPageQuery
   ): Promise<DPromptDescriptorsPage> {
      const { pagination } = query || {};
      const { pageNumber, pageSize } = pagination || DEFAULT_PAGINATION;

      const whereClause = this.resolveGetPromptDescriptorsWhereInput(
         userId,
         query
      );

      const [data, count] = await Promise.all([
         this.prisma.promptDescriptor.findMany({
            where: whereClause,
            skip: pageNumber * pageSize,
            take: pageSize,
            include: {
               categories: true,
            },
            orderBy: { updatedAt: "desc" },
         }),
         this.prisma.promptDescriptor.count({
            where: whereClause,
         }),
      ]);

      const dbResult: PromptDescriptorsPage = {
         content: data as PromptDescriptorWithRelations[],
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
   ): Promise<DPromptDescriptor | null> {
      const data: PromptDescriptorWithRelations | null =
         await this.prisma.promptDescriptor.findFirst({
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

   async pGetPromptCategories(userId: string): Promise<DPromptCategory[]> {
      return await this.prisma.promptCategory.findMany({
         where: { userId },
         select: {
            name: true,
         },
      });
   }

   async pCreatePrompt(userId: string, data: DPromptUpdate) {
      const categories = this.createOrConnectCategories(
         userId,
         data.categories
      );
      const followUps = this.createFollowUpsInput(data.followUpPrompts);

      const toSave: PromptDescriptorCreateInput = {
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

      return await this.prisma.promptDescriptor.create({
         data: toSave,
      });
   }

   async pUpdatePrompt(
      userId: string,
      promptId: string,
      data: DPromptUpdate,
      current: DPromptDescriptor,
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

      const toSave: PromptDescriptorUpdateInput = {
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

      return await this.prisma.promptDescriptor.update({
         where: { id: promptId, userId },
         data: toSave,
      });
   }

   async pToggleFavorite(
      userId: string,
      promptId: string,
      isFavorite: boolean
   ) {
      await this.prisma.promptDescriptor.update({
         where: { id: promptId, userId },
         data: { isFavorite },
      });
   }

   async pDeletePrompt(userId: string, promptId: string) {
      await this.prisma.promptDescriptor.delete({
         where: { id: promptId, userId },
      });
   }

   followUpPromptUpdates(
      current: DPromptDescriptor,
      promptUpdate: DPromptUpdate
   ): PromptFollowUpUpdateManyWithoutPromptNestedInput {
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
   ): PromptCategoryCreateOrConnectWithoutPromptsInput[] {
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
      followUpPrompts: DPromptFollowUpUpdate[]
   ): PromptFollowUpCreateWithoutPromptInput[] {
      return map(followUpPrompts, (f) => ({
         content: f.content,
         order: f.order,
      }));
   }

   private updateFollowUpsInput(
      followUpPrompts: DPromptFollowUpUpdate[]
   ): PromptFollowUpUpdateWithWhereUniqueWithoutPromptInput[] {
      return map(followUpPrompts, (f) => ({
         where: { id: f.id! },
         data: { content: f.content, order: f.order },
      }));
   }

   private deleteFollowUpsInput(
      followUpPromptIds: string[]
   ): PromptFollowUpScalarWhereInput {
      return {
         id: {
            in: followUpPromptIds,
         },
      };
   }

   private resolveGetPromptDescriptorsWhereInput(
      userId: string,
      query?: DPromptDescriptorsPageQuery
   ): PromptDescriptorWhereInput | undefined {
      const { globalFilter, filter } = query || {};
      const { categories, isFavorite } = filter || {};

      const searchClause: PromptDescriptorWhereInput[] | undefined =
         globalFilter
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
      const categoriesClause: PromptDescriptorWhereInput[] | undefined =
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
