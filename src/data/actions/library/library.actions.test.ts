jest.mock("@/data/db/queries/library");
jest.mock("../auth-utils");

import { dtestData, ptestData } from "@tests";
import { forEach, map } from "es-toolkit/compat";

import { LibraryRepository } from "@/data/db/queries/library";
import { requireUser } from "../auth-utils";

import { createLibraryEntries, getLibraryEntries } from "./library.actions";
import { toDLibraryEntries } from "./library.mapper";

const pGetLibraryEntries = LibraryRepository.prototype.pGetLibraryEntries;
const pCreateLibraryEntries = LibraryRepository.prototype.pCreateLibraryEntries;

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const pGetLibraryEntriesMock = pGetLibraryEntries as jest.MockedFunction<
   typeof pGetLibraryEntries
>;

const pCreateLibraryEntriesMock = pCreateLibraryEntries as jest.MockedFunction<
   typeof pCreateLibraryEntries
>;

describe("getLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
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

describe("createLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createLibraryEntries - order.items empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 0);

      await createLibraryEntries(order);

      expect(pCreateLibraryEntriesMock).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);
      forEach(order.items, (item) => {
         item.product.productItems = [];
      });

      await createLibraryEntries(order);

      expect(pCreateLibraryEntriesMock).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds saved - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);

      await createLibraryEntries(order);

      expect(pCreateLibraryEntriesMock).toHaveBeenCalledTimes(3);

      forEach(order.items, (item, index) => {
         const templateIds = map(
            item.product.productItems,
            (i) => i.templateId
         );
         expect(pCreateLibraryEntriesMock).toHaveBeenNthCalledWith(
            index + 1,
            order.id,
            order.userId,
            item.product.id,
            templateIds
         );
      });
   });
});
