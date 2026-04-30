import { dtestData } from "@tests";

import { Sort } from "@/data/types/common";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";
import {
   PromptDescriptorOrderByWithRelationInput,
   PromptTemplateDescriptorWhereInput,
} from "@/generated/prisma/models";

import { resolveOrderBy, resolveWhereInput } from "./utils";

describe("resolveWhereInput tests", () => {
   const userId = "user-id-1";

   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("userId undefined - filter undefined - test", async () => {
      const result = resolveWhereInput();
      const expectedWhere: PromptTemplateDescriptorWhereInput = {};
      expect(result).toEqual(expectedWhere);
   });

   test("filter undefined- test", async () => {
      const result = resolveWhereInput(userId);
      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter.search - test", async () => {
      const filter: DTemplateDescriptorsFilter = {
         search: "test search",
      };

      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         OR: [
            {
               title: {
                  contains: "test search",
                  mode: "insensitive",
               },
            },
            {
               description: {
                  contains: "test search",
                  mode: "insensitive",
               },
            },
         ],
      };

      expect(result).toEqual(expectedWhere);
   });

   test("fitler.categories - test", async () => {
      const filter: DTemplateDescriptorsFilter = {
         categories: ["cat1", "cat2"],
      };
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         categories: { some: { name: { in: ["cat1", "cat2"] } } },
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter.models - test", async () => {
      const filter: DTemplateDescriptorsFilter = {
         models: ["gpt-4", "claude"],
      };
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         recommendedModel: { in: ["gpt-4", "claude"] },
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter.isFavorite true - test", async () => {
      const filter: DTemplateDescriptorsFilter = {
         isFavorite: true,
      };
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         isFavorite: true,
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter.isFavorite false - test", async () => {
      const filter: DTemplateDescriptorsFilter = {
         isFavorite: false,
      };
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         isFavorite: false,
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter.collectionIds - test", async () => {
      const filter: DTemplateDescriptorsFilter = {
         collectionIds: ["col-1", "col-2"],
      };
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         collectionEntries: {
            some: { collectionId: { in: ["col-1", "col-2"] } },
         },
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter empty arrays - test", async () => {
      const filter: DTemplateDescriptorsFilter = {
         categories: [],
         models: [],
         collectionIds: [],
      };
      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
      };

      expect(result).toEqual(expectedWhere);
   });

   test("filter - all fields - test", async () => {
      const filter = dtestData.dTemplateDescriptorsFilter();

      const result = resolveWhereInput(userId, filter);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         OR: [
            {
               title: {
                  contains: filter.search,
                  mode: "insensitive",
               },
            },
            {
               description: {
                  contains: filter.search,
                  mode: "insensitive",
               },
            },
         ],
         categories: {
            some: { name: { in: filter.categories } },
         },
         recommendedModel: { in: filter.models },
         isFavorite: filter.isFavorite,
         collectionEntries: {
            some: { collectionId: { in: filter.collectionIds } },
         },
      };

      expect(result).toEqual(expectedWhere);
   });
});

describe("resolveOrderBy tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("sort undefined - test", async () => {
      const result = resolveOrderBy();
      const expectedWhere: PromptDescriptorOrderByWithRelationInput = {
         createdAt: "desc" as const,
      };
      expect(result).toEqual(expectedWhere);
   });

   test("sort defined - test", async () => {
      const sort: Sort = {
         field: "title",
         order: "asc",
      };
      const result = resolveOrderBy(sort);
      const expectedWhere: PromptDescriptorOrderByWithRelationInput = {
         title: "asc" as const,
      };
      expect(result).toEqual(expectedWhere);
   });
});
