jest.mock("@/data/repositories/library");
jest.mock("@/data/services/prompt");
jest.mock("@/data/actions/auth-utils");

import { dtestData, ptestData } from "@tests";
import { forEach, map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import { requireUser } from "@/data/actions/auth-utils";
import { LibraryRepository } from "@/data/repositories/library";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { PromptService } from "@/data/services/prompt";

import { toDLibraryEntries } from "./library.mapper";
import { LibraryService } from "./library.service";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const serviceFactory = new ServiceFactory(prisma);
const promptService = serviceFactory.getPromptService();

const promptServiceMock = promptService as DeepMockProxy<PromptService>;

const libraryRepo = new LibraryRepository(prisma);
const libraryRepoMock = libraryRepo as DeepMockProxy<LibraryRepository>;

const libraryService = new LibraryService(libraryRepoMock, promptServiceMock);

describe("getLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getLibraryEntries - user undefined - test", async () => {
      const entries = ptestData.pLibraryEntriesWithTemplate();
      requireUserMock.mockRejectedValue("Unknow user");
      libraryRepoMock.pGetLibraryEntries.mockResolvedValue(entries);

      const result = await libraryService.getLibraryEntries();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).not.toHaveBeenCalled();
   });

   it("getLibraryEntries - db error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntries.mockRejectedValue("db error");

      const result = await libraryService.getLibraryEntries();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledWith(user.id);
   });

   it("getLibraryEntries - entries retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const entries = ptestData.pLibraryEntriesWithTemplate();
      requireUserMock.mockResolvedValue(user);
      libraryRepoMock.pGetLibraryEntries.mockResolvedValue(entries);

      const result = await libraryService.getLibraryEntries();

      const expectedResult = toDLibraryEntries(entries);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryRepoMock.pGetLibraryEntries).toHaveBeenCalledWith(user.id);
   });
});

describe("createLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createLibraryEntries - order.items empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 0);

      await libraryService.createLibraryEntries(order);

      expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds empty - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);
      forEach(order.items, (item) => {
         item.product.productItems = [];
      });

      await libraryService.createLibraryEntries(order);

      expect(libraryRepoMock.pCreateLibraryEntries).not.toHaveBeenCalled();
   });

   it("createLibraryEntries - templateIds saved - test", async () => {
      const order = ptestData.pOrderProducts(1, 3);

      await libraryService.createLibraryEntries(order);

      expect(libraryRepoMock.pCreateLibraryEntries).toHaveBeenCalledTimes(3);

      forEach(order.items, (item, index) => {
         const templateIds = map(
            item.product.productItems,
            (i) => i.templateId
         );
         expect(libraryRepoMock.pCreateLibraryEntries).toHaveBeenNthCalledWith(
            index + 1,
            order.id,
            order.userId,
            item.product.id,
            templateIds
         );
      });
   });
});
