import { dtestData } from "@tests";

import { DUser, DUserInternal } from "@/data/types/domain/user";

import { toDUser } from "./user.mapper";

const toDUserInternal = (user: DUserInternal): DUser => {
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
   };
};

describe("toDUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDUser test", async () => {
      const userInternal = dtestData.dUserInternal();
      const result = toDUser(userInternal);
      const expectedResult = toDUserInternal(userInternal);
      expect(result).toEqual(expectedResult);
   });
});
