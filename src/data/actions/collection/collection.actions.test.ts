jest.mock("@/data/services/collection");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { CollectionService } from "@/data/services/collection";
import { DLibraryCollection } from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";

import {
   createLibraryCollection,
   deleteLibraryCollection,
   getEntryCollectionIds,
   getLibraryCollections,
   updateEntryCollections,
   updateLibraryCollection,
} from "./collection.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetCollections = CollectionService.prototype.getCollections;
const sCreateCollection = CollectionService.prototype.createCollection;
const sUpdateCollection = CollectionService.prototype.updateCollection;
const sDeleteCollection = CollectionService.prototype.deleteCollection;
const sGetEntryCollectionIds =
   CollectionService.prototype.getEntryCollectionIds;
const sUpdateEntryCollections =
   CollectionService.prototype.updateEntryCollections;

const sGetCollectionsMock = sGetCollections as jest.MockedFunction<
   typeof sGetCollections
>;
const sCreateCollectionMock = sCreateCollection as jest.MockedFunction<
   typeof sCreateCollection
>;
const sUpdateCollectionMock = sUpdateCollection as jest.MockedFunction<
   typeof sUpdateCollection
>;
const sDeleteCollectionMock = sDeleteCollection as jest.MockedFunction<
   typeof sDeleteCollection
>;
const sUpdateEntryCollectionsMock =
   sUpdateEntryCollections as jest.MockedFunction<
      typeof sUpdateEntryCollections
   >;
const sGetEntryCollectionIdsMock =
   sGetEntryCollectionIds as jest.MockedFunction<typeof sGetEntryCollectionIds>;

describe("getLibraryCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getLibraryCollections - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getLibraryCollections();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getLibraryCollections - entries retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collections = dtestData.dLibraryCollections();
      sGetCollectionsMock.mockResolvedValue(collections);

      const result = await getLibraryCollections();

      expect(result).toEqual(collections);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionsMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionsMock).toHaveBeenCalledWith(user.id);
   });
});

describe("createLibraryCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("createLibraryCollection - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const newCollection = dtestData.dLibraryCollectionUpdate();
      const result = await createLibraryCollection(newCollection);
      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateCollectionMock).not.toHaveBeenCalled();
   });

   it("createLibraryCollection - success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const createdCollection = dtestData.dLibraryCollection();
      sCreateCollectionMock.mockResolvedValue(createdCollection);

      const newCollection = dtestData.dLibraryCollectionUpdate();
      const result = await createLibraryCollection(newCollection);

      const expectedResult: ActionResult<DLibraryCollection> = {
         success: true,
         message: "Sammlung erfolgreich erstellt",
         data: createdCollection,
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCollectionMock).toHaveBeenCalledTimes(1);
      expect(sCreateCollectionMock).toHaveBeenCalledWith(
         user.id,
         newCollection
      );
   });

   it("createLibraryCollection - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const errorMessage = "Db error";
      const error = new Error(errorMessage);
      sCreateCollectionMock.mockRejectedValue(error);

      const newCollection = dtestData.dLibraryCollectionUpdate();
      const result = await createLibraryCollection(newCollection);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCollectionMock).toHaveBeenCalledTimes(1);
      expect(sCreateCollectionMock).toHaveBeenCalledWith(
         user.id,
         newCollection
      );
   });
});

describe("updateLibraryCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("updateLibraryCollection - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const data = dtestData.dLibraryCollectionUpdate();
      const result = await updateLibraryCollection(invalidId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateCollectionMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const data = dtestData.dLibraryCollectionUpdate();
      const result = await updateLibraryCollection(collectionId, data);
      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateCollectionMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const errorMessage = "DB Error";
      const error = new Error(errorMessage);
      sUpdateCollectionMock.mockRejectedValue(error);

      const data = dtestData.dLibraryCollectionUpdate();
      const result = await updateLibraryCollection(collectionId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateCollectionMock).toHaveBeenCalledTimes(1);
      expect(sUpdateCollectionMock).toHaveBeenCalledWith(
         user.id,
         collectionId,
         data
      );
   });

   it("collection - updated - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";

      sUpdateCollectionMock.mockResolvedValue();

      const data = dtestData.dLibraryCollectionUpdate();
      const result = await updateLibraryCollection(collectionId, data);

      const expectedResult: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Sammlung erfolgreich aktualisiert",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateCollectionMock).toHaveBeenCalledTimes(1);
      expect(sUpdateCollectionMock).toHaveBeenCalledWith(
         user.id,
         collectionId,
         data
      );
   });
});

describe("deleteLibraryCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deleteLibraryCollection(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteCollectionMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const result = await deleteLibraryCollection(collectionId);
      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCollectionMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const errorMessage = "DB Error";
      const error = new Error(errorMessage);
      sDeleteCollectionMock.mockRejectedValue(error);

      const result = await deleteLibraryCollection(collectionId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteCollectionMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCollectionMock).toHaveBeenCalledWith(user.id, collectionId);
   });

   it("colection - deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";

      sDeleteCollectionMock.mockResolvedValue();

      const result = await deleteLibraryCollection(collectionId);

      const expectedResult: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Sammlung erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteCollectionMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCollectionMock).toHaveBeenCalledWith(user.id, collectionId);
   });
});

describe("getEntryCollectionIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getEntryCollectionIds - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getEntryCollectionIds(invalidId);

      expect(result).toEqual([]);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetEntryCollectionIdsMock).not.toHaveBeenCalled();
   });

   it("getEntryCollectionIds - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getEntryCollectionIds(entryId);

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetEntryCollectionIdsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getEntryCollectionIds - collectionIds retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionIds = dtestData.dLibraryCollectionIds();
      sGetEntryCollectionIdsMock.mockResolvedValue(collectionIds);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getEntryCollectionIds(entryId);

      expect(result).toEqual(collectionIds);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetEntryCollectionIdsMock).toHaveBeenCalledTimes(1);
      expect(sGetEntryCollectionIdsMock).toHaveBeenCalledWith(user.id, entryId);
   });
});

describe("updateEntryCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("updateEntryCollections - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const collectionsId = dtestData.dLibraryCollectionIds();
      const result = await updateEntryCollections(invalidId, collectionsId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlungen konnten nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateEntryCollectionsMock).not.toHaveBeenCalled();
   });

   it("updateEntryCollections - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";
      const collectionsId = dtestData.dLibraryCollectionIds();

      const result = await updateEntryCollections(entryId, collectionsId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlungen konnten nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateEntryCollectionsMock).not.toHaveBeenCalled();
   });

   it("updateEntryCollections - success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sUpdateEntryCollectionsMock.mockResolvedValue();

      const entryId = "123e4567-e89b-12d3-a456-426614174000";
      const collectionsId = dtestData.dLibraryCollectionIds();

      const result = await updateEntryCollections(entryId, collectionsId);

      const expectedResult: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Sammlungen aktualisiert",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateEntryCollectionsMock).toHaveBeenCalledTimes(1);
      expect(sUpdateEntryCollectionsMock).toHaveBeenCalledWith(
         user.id,
         entryId,
         collectionsId
      );
   });

   it("updateEntryCollections - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const errorMessage = "DB Error";
      const error = new Error(errorMessage);
      sUpdateEntryCollectionsMock.mockRejectedValue(error);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";
      const collectionsId = dtestData.dLibraryCollectionIds();

      const result = await updateEntryCollections(entryId, collectionsId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlungen konnten nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateEntryCollectionsMock).toHaveBeenCalledTimes(1);
      expect(sUpdateEntryCollectionsMock).toHaveBeenCalledWith(
         user.id,
         entryId,
         collectionsId
      );
   });
});
