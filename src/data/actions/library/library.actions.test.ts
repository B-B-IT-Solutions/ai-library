jest.mock("@/data/db/queries/library");
jest.mock("../auth-utils");

import { dtestData, ptestData } from "@tests";

import { pGetLibraryEntries } from "@/data/db/queries/library";
import { requireUser } from "../auth-utils";

import { getLibraryEntries } from "./library.actions";
import { toDLibraryEntries } from "./library.mapper";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const pGetLibraryEntriesMock = pGetLibraryEntries as jest.MockedFunction<
   typeof pGetLibraryEntries
>;

describe("getLibraryEntries tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getLibraryEntries - user undefined - test", async () => {
      const entries = ptestData.pLibraryEntriesWithTemplate();
      requireUserMock.mockRejectedValue("Unknow user");
      pGetLibraryEntriesMock.mockResolvedValue(entries);

      const result = await getLibraryEntries();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetLibraryEntriesMock).not.toHaveBeenCalled();
   });

   it("getLibraryEntries - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      pGetLibraryEntriesMock.mockRejectedValue("db error");

      const result = await getLibraryEntries();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetLibraryEntriesMock).toHaveBeenCalledTimes(1);
      expect(pGetLibraryEntriesMock).toHaveBeenCalledWith(user.id);
   });

   it("getLibraryEntries - entries retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const entries = ptestData.pLibraryEntriesWithTemplate();
      requireUserMock.mockResolvedValue(user);
      pGetLibraryEntriesMock.mockResolvedValue(entries);

      const result = await getLibraryEntries();

      const expectedResult = toDLibraryEntries(entries);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetLibraryEntriesMock).toHaveBeenCalledTimes(1);
      expect(pGetLibraryEntriesMock).toHaveBeenCalledWith(user.id);
   });
});
