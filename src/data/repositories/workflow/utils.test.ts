import {
   WorkflowOrderByWithRelationInput,
   WorkflowWhereInput,
} from "@/generated/prisma/models/Workflow";

import { resolveOrderBy, resolveWhereInput } from "./utils";

describe("resolveWhereInput", () => {
   it("no filter - only userId", () => {
      const result = resolveWhereInput("user-1");

      const expected: WorkflowWhereInput = { userId: "user-1" };
      expect(result).toEqual(expected);
   });

   it("empty filter - only userId", () => {
      const result = resolveWhereInput("user-1", {});

      const expected: WorkflowWhereInput = { userId: "user-1" };
      expect(result).toEqual(expected);
   });

   it("search filter - adds title contains", () => {
      const result = resolveWhereInput("user-1", { search: "my flow" });

      const expected: WorkflowWhereInput = {
         userId: "user-1",
         title: { contains: "my flow", mode: "insensitive" },
      };
      expect(result).toEqual(expected);
   });

   it("empty search - no title filter", () => {
      const result = resolveWhereInput("user-1", { search: "" });

      const expected: WorkflowWhereInput = { userId: "user-1" };
      expect(result).toEqual(expected);
   });
});

describe("resolveOrderBy", () => {
   it("no sort - defaults to createdAt desc", () => {
      const result = resolveOrderBy();

      const expected: WorkflowOrderByWithRelationInput = { createdAt: "desc" };
      expect(result).toEqual(expected);
   });

   it("sort by title asc", () => {
      const result = resolveOrderBy({ field: "title", order: "asc" });

      const expected: WorkflowOrderByWithRelationInput = { title: "asc" };
      expect(result).toEqual(expected);
   });

   it("sort by createdAt asc", () => {
      const result = resolveOrderBy({ field: "createdAt", order: "asc" });

      const expected: WorkflowOrderByWithRelationInput = { createdAt: "asc" };
      expect(result).toEqual(expected);
   });
});
