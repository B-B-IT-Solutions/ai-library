import { filter, isEmpty, isEqual, map } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { PromptRepository } from "@/data/repositories/prompt";
import { PromptDescriptorWithRelations } from "@/data/types/db/prompt";
import {
   DPromptCategory,
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
   DPromptFollowUpUpdate,
   DPromptUpdate,
} from "@/data/types/domain/prompt";
import { updatePromptSchema } from "@/data/types/validators/prompt";
import {
   PromptCategoryCreateOrConnectWithoutPromptsInput,
   PromptDescriptorCreateInput,
   PromptDescriptorUpdateInput,
   PromptFollowUpCreateWithoutPromptInput,
   PromptFollowUpScalarWhereInput,
   PromptFollowUpUpdateManyWithoutPromptNestedInput,
   PromptFollowUpUpdateWithWhereUniqueWithoutPromptInput,
} from "@/generated/prisma/models";

import { toDPromptDescriptor, toDPromptDescriptorsPage } from "./prompt.mapper";

export class PromptService {
   private promptRepository: PromptRepository;

   constructor(promptRepository: PromptRepository) {
      this.promptRepository = promptRepository;
   }

   async getPrompts(
      userId: string,
      query?: DPromptDescriptorsPageQuery
   ): Promise<DPromptDescriptorsPage> {
      const data = await this.promptRepository.pGetPromptDescriptors(
         userId,
         query
      );
      return toDPromptDescriptorsPage(data);
   }

   async getPrompt(id: string): Promise<DPromptDescriptor | undefined> {
      if (isValidUuid(id)) {
         const data = await this.promptRepository.pGetPromptDescriptor({ id });
         if (data) {
            return toDPromptDescriptor(data);
         }
      }
      return undefined;
   }

   async getPromptCategories(): Promise<DPromptCategory[]> {
      return await this.promptRepository.pGetPromptCategories();
   }

   async createPrompt(userId: string, data: DPromptUpdate) {
      const prompt = updatePromptSchema.parse(data);
      const categories = this.createOrConnectCategories(prompt.categories);
      const followUps = this.createFollowUpsInput(prompt.followUpPrompts);

      const toSave: PromptDescriptorCreateInput = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
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

      await this.promptRepository.pCreatePrompt(toSave);
   }

   async updatePrompt(
      promptId: string,
      data: DPromptUpdate,
      createVersion: boolean
   ) {
      const current = await this.promptRepository.pGetPromptDescriptor({
         id: promptId,
      });

      if (!current) {
         throw new Error("Prompt not found");
      }
      const update = updatePromptSchema.parse(data);
      const { content, currentVersion } = current;
      const updateVersions = createVersion && !isEqual(content, update.content);

      const versionIdx = updateVersions ? currentVersion + 1 : currentVersion;

      let versions = undefined;
      if (updateVersions) {
         versions = {
            create: {
               version: versionIdx,
               content: update.content,
            },
         };
      }

      const categories = this.createOrConnectCategories(update.categories);
      const followUpPrompts = this.followUpPromptUpdates(current, update);

      const toSave: PromptDescriptorUpdateInput = {
         title: update.title,
         content: update.content,
         recommendedModel: update.recommendedModel,
         currentVersion: versionIdx,
         categories: {
            set: [],
            connectOrCreate: categories,
         },
         followUpPrompts,
         versions,
      };

      await this.promptRepository.pUpdatePrompt(promptId, toSave);
   }

   async toggleFavorite(id: string, isFavorite: boolean) {
      await this.promptRepository.pToggleFavorite(id, isFavorite);
   }

   async deletePrompt(id: string) {
      await this.promptRepository.pDeletePrompt(id);
   }

   followUpPromptUpdates(
      current: PromptDescriptorWithRelations,
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

      const followUpPromptUpdates: PromptFollowUpUpdateManyWithoutPromptNestedInput =
         {
            update,
            create,
            deleteMany,
         };

      return followUpPromptUpdates;
   }

   private createOrConnectCategories(
      categories: string[]
   ): PromptCategoryCreateOrConnectWithoutPromptsInput[] {
      return map(categories, (cat: string) => {
         return {
            where: {
               name: cat,
            },
            create: {
               name: cat,
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
}
