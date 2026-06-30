import { DAdminUsersPageQuery } from "@/data/types/domain/admin/user";
import { UserWhereInput } from "@/generated/prisma/models";

import { resolveWhereInput } from "./utils";

describe("resolveWhereInput tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("query undefined - test", () => {
      const result = resolveWhereInput(undefined);

      const expected: UserWhereInput = {};
      expect(result).toEqual(expected);
   });

   test("filter undefined - test", () => {
      const query: DAdminUsersPageQuery = {};

      const result = resolveWhereInput(query);

      const expected: UserWhereInput = {};
      expect(result).toEqual(expected);
   });

   test("filter.search undefined - test", () => {
      const query: DAdminUsersPageQuery = { filter: {} };

      const result = resolveWhereInput(query);

      const expected: UserWhereInput = {};
      expect(result).toEqual(expected);
   });

   test("filter.search empty string - test", () => {
      const query: DAdminUsersPageQuery = { filter: { search: "" } };

      const result = resolveWhereInput(query);

      const expected: UserWhereInput = {};
      expect(result).toEqual(expected);
   });

   test("filter.search - test", () => {
      const query: DAdminUsersPageQuery = { filter: { search: "john" } };

      const result = resolveWhereInput(query);

      const expected: UserWhereInput = {
         OR: [
            { name: { contains: "john", mode: "insensitive" } },
            { email: { contains: "john", mode: "insensitive" } },
         ],
      };
      expect(result).toEqual(expected);
   });
});
