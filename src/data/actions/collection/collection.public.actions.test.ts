jest.mock("@/data/services/collection");

import { dtestData } from "@tests";

import { PublicCollectionService } from "@/data/services/collection";

import { getPublicCollectionByToken } from "./collection.public.actions";

const sGetCollectionByPublicToken =
   PublicCollectionService.prototype.getCollectionByPublicToken;

const sGetCollectionByPublicTokenMock =
   sGetCollectionByPublicToken as jest.MockedFunction<
      typeof sGetCollectionByPublicToken
   >;

describe("getPublicCollectionByToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid token - test", async () => {
      const result = await getPublicCollectionByToken("");

      expect(result).toBeNull();
      expect(sGetCollectionByPublicTokenMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid token.");
   });

   it("collection retrieved - test", async () => {
      const collection = dtestData.dCollection();
      sGetCollectionByPublicTokenMock.mockResolvedValue(collection);

      const token = "token-1";

      const result = await getPublicCollectionByToken(token);

      expect(result).toEqual(collection);
      expect(sGetCollectionByPublicTokenMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionByPublicTokenMock).toHaveBeenCalledWith(token);
   });
});
