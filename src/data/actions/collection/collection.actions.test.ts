jest.mock("@/data/services/collection");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { CollectionService } from "@/data/services/collection";
import { DCollection } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

import {
   addPromptToCollection,
   createCollection,
   deleteCollection,
   getCollectionById,
   getCollectionPromptIds,
   getCollections,
   getTemplateCollectionIds,
   removePromptFromCollection,
   setCollectionPublic,
   updateCollection,
   updateTemplateCollections,
} from "./collection.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetCollections = CollectionService.prototype.getCollections;
const sGetCollectionById = CollectionService.prototype.getCollectionById;
const sCreateCollection = CollectionService.prototype.createCollection;
const sUpdateCollection = CollectionService.prototype.updateCollection;
const sDeleteCollection = CollectionService.prototype.deleteCollection;
const sAddPromptToCollection =
   CollectionService.prototype.addPromptToCollection;
const sRemovePromptFromCollection =
   CollectionService.prototype.removePromptFromCollection;
const sSetCollectionPublic = CollectionService.prototype.setCollectionPublic;
const sGetCollectionPromptIds =
   CollectionService.prototype.getCollectionPromptIds;
const sGetEntryCollectionIds =
   CollectionService.prototype.getTemplateCollectionIds;
const sUpdateEntryCollections =
   CollectionService.prototype.updateTemplateCollections;

const sGetCollectionsMock = sGetCollections as jest.MockedFunction<
   typeof sGetCollections
>;
const sGetCollectionByIdMock = sGetCollectionById as jest.MockedFunction<
   typeof sGetCollectionById
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
const sAddPromptToCollectionMock =
   sAddPromptToCollection as jest.MockedFunction<typeof sAddPromptToCollection>;
const sRemovePromptFromCollectionMock =
   sRemovePromptFromCollection as jest.MockedFunction<
      typeof sRemovePromptFromCollection
   >;
const sSetCollectionPublicMock = sSetCollectionPublic as jest.MockedFunction<
   typeof sSetCollectionPublic
>;
const sUpdateEntryCollectionsMock =
   sUpdateEntryCollections as jest.MockedFunction<
      typeof sUpdateEntryCollections
   >;
const sGetCollectionPromptIdsMock =
   sGetCollectionPromptIds as jest.MockedFunction<
      typeof sGetCollectionPromptIds
   >;
const sGetEntryCollectionIdsMock =
   sGetEntryCollectionIds as jest.MockedFunction<typeof sGetEntryCollectionIds>;

describe("getCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getCollections();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("entries retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collections = dtestData.dCollections();
      sGetCollectionsMock.mockResolvedValue(collections);

      const result = await getCollections();

      expect(result).toEqual(collections);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionsMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionsMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getCollectionById tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getCollectionById(invalidId);

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetCollectionByIdMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid collection ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getCollectionById(collectionId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionByIdMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("collection retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collection = dtestData.dCollection();
      sGetCollectionByIdMock.mockResolvedValue(collection);

      const result = await getCollectionById(collection.id);

      expect(result).toEqual(collection);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionByIdMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionByIdMock).toHaveBeenCalledWith(
         user.id,
         collection.id
      );
   });
});

describe("createCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const newCollection = dtestData.dCollectionUpdate();
      const result = await createCollection(newCollection);
      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateCollectionMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const errorMessage = "Db error";
      const error = new Error(errorMessage);
      sCreateCollectionMock.mockRejectedValue(error);

      const newCollection = dtestData.dCollectionUpdate();
      const result = await createCollection(newCollection);

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

   it("collection - created - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const createdCollection = dtestData.dCollection();
      sCreateCollectionMock.mockResolvedValue(createdCollection);

      const newCollection = dtestData.dCollectionUpdate();
      const result = await createCollection(newCollection);

      const expectedResult: ActionResult<DCollection> = {
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
});

describe("updateCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const data = dtestData.dCollectionUpdate();
      const result = await updateCollection(invalidId, data);

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

      const data = dtestData.dCollectionUpdate();
      const result = await updateCollection(collectionId, data);
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

      const data = dtestData.dCollectionUpdate();
      const result = await updateCollection(collectionId, data);

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

      const collection = dtestData.dCollection();
      sUpdateCollectionMock.mockResolvedValue(collection);

      const data = dtestData.dCollectionUpdate();
      const result = await updateCollection(collection.id, data);

      const expectedResult: ActionResult<DCollection> = {
         success: true,
         message: "Sammlung erfolgreich aktualisiert",
         data: collection,
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateCollectionMock).toHaveBeenCalledTimes(1);
      expect(sUpdateCollectionMock).toHaveBeenCalledWith(
         user.id,
         collection.id,
         data
      );
   });
});

describe("deleteCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deleteCollection(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const result = await deleteCollection(collectionId);
      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const errorMessage = "DB Error";
      const error = new Error(errorMessage);
      sDeleteCollectionMock.mockRejectedValue(error);

      const result = await deleteCollection(collectionId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlung konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteCollectionMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCollectionMock).toHaveBeenCalledWith(user.id, collectionId);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("colection - deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";

      sDeleteCollectionMock.mockResolvedValue();

      const result = await deleteCollection(collectionId);

      const expectedResult: ActionResult = {
         success: true,
         message: "Sammlung erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteCollectionMock).toHaveBeenCalledTimes(1);
      expect(sDeleteCollectionMock).toHaveBeenCalledWith(user.id, collectionId);
   });
});

describe("getCollectionPromptIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getCollectionPromptIds(invalidId);

      expect(result).toEqual([]);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetCollectionPromptIdsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid collection ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getCollectionPromptIds(collectionId);

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionPromptIdsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("DB Error");
      sGetCollectionPromptIdsMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getCollectionPromptIds(collectionId);

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionPromptIdsMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionPromptIdsMock).toHaveBeenCalledWith(
         user.id,
         collectionId
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("promptIds retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const templateIds = dtestData.dCollectionIds();
      sGetCollectionPromptIdsMock.mockResolvedValue(templateIds);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getCollectionPromptIds(collectionId);

      expect(result).toEqual(templateIds);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionPromptIdsMock).toHaveBeenCalledTimes(1);
      expect(sGetCollectionPromptIdsMock).toHaveBeenCalledWith(
         user.id,
         collectionId
      );
   });
});

describe("addPromptToCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid collectionId UUID - test", async () => {
      const invalidCollectionId = "invalid-uuid-1";
      const promptId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await addPromptToCollection(invalidCollectionId, promptId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht hinzugefügt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sAddPromptToCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("invalid templateDescriptorId UUID - test", async () => {
      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const invalidPromptId = "invalid-uuid-1";

      const result = await addPromptToCollection(collectionId, invalidPromptId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht hinzugefügt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sAddPromptToCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const promptId = "223e4567-e89b-12d3-a456-426614174000";

      const result = await addPromptToCollection(collectionId, promptId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht hinzugefügt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sAddPromptToCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("DB Error");
      sAddPromptToCollectionMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const promptId = "223e4567-e89b-12d3-a456-426614174000";

      const result = await addPromptToCollection(collectionId, promptId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht hinzugefügt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sAddPromptToCollectionMock).toHaveBeenCalledTimes(1);
      expect(sAddPromptToCollectionMock).toHaveBeenCalledWith(
         user.id,
         collectionId,
         promptId
      );
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("template - added - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sAddPromptToCollectionMock.mockResolvedValue();

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const promptId = "223e4567-e89b-12d3-a456-426614174000";

      const result = await addPromptToCollection(collectionId, promptId);

      const expectedResult: ActionResult = {
         success: true,
         message: "Prompt hinzugefügt",
      };

      expect(result).toEqual(expectedResult);
      expect(sAddPromptToCollectionMock).toHaveBeenCalledTimes(1);
      expect(sAddPromptToCollectionMock).toHaveBeenCalledWith(
         user.id,
         collectionId,
         promptId
      );
   });
});

describe("removeTemplateFromCollection tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid collectionId UUID - test", async () => {
      const invalidCollectionId = "invalid-uuid-1";
      const promptId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await removePromptFromCollection(
         invalidCollectionId,
         promptId
      );

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht entfernt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sRemovePromptFromCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("invalid promptId UUID - test", async () => {
      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const invalidPromptId = "invalid-uuid-1";

      const result = await removePromptFromCollection(
         collectionId,
         invalidPromptId
      );

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht entfernt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sRemovePromptFromCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const promptId = "223e4567-e89b-12d3-a456-426614174000";

      const result = await removePromptFromCollection(collectionId, promptId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht entfernt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sRemovePromptFromCollectionMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("DB Error");
      sRemovePromptFromCollectionMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const promptId = "223e4567-e89b-12d3-a456-426614174000";

      const result = await removePromptFromCollection(collectionId, promptId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht entfernt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sRemovePromptFromCollectionMock).toHaveBeenCalledTimes(1);
      expect(sRemovePromptFromCollectionMock).toHaveBeenCalledWith(
         user.id,
         collectionId,
         promptId
      );
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompt - removed - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sRemovePromptFromCollectionMock.mockResolvedValue();

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const promptId = "223e4567-e89b-12d3-a456-426614174000";

      const result = await removePromptFromCollection(collectionId, promptId);

      const expectedResult: ActionResult = {
         success: true,
         message: "Prompt entfernt",
      };

      expect(result).toEqual(expectedResult);
      expect(sRemovePromptFromCollectionMock).toHaveBeenCalledTimes(1);
      expect(sRemovePromptFromCollectionMock).toHaveBeenCalledWith(
         user.id,
         collectionId,
         promptId
      );
   });
});

describe("setCollectionPublic tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const result = await setCollectionPublic("invalid-uuid-1", true);

      const expectedResult: ActionResult = {
         success: false,
         message: "Freigabe konnte nicht geändert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sSetCollectionPublicMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid collection ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const result = await setCollectionPublic(collectionId, true);

      const expectedResult: ActionResult = {
         success: false,
         message: "Freigabe konnte nicht geändert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sSetCollectionPublicMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("DB Error");
      sSetCollectionPublicMock.mockRejectedValue(error);

      const collectionId = "123e4567-e89b-12d3-a456-426614174000";
      const result = await setCollectionPublic(collectionId, true);

      const expectedResult: ActionResult = {
         success: false,
         message: "Freigabe konnte nicht geändert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sSetCollectionPublicMock).toHaveBeenCalledTimes(1);
      expect(sSetCollectionPublicMock).toHaveBeenCalledWith(
         user.id,
         collectionId,
         true
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("isPublic true - collection set public - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collection = dtestData.dCollection();
      sSetCollectionPublicMock.mockResolvedValue(collection);

      const result = await setCollectionPublic(collection.id, true);

      const expectedResult: ActionResult<DCollection> = {
         success: true,
         message: "Sammlung ist jetzt öffentlich zugänglich",
         data: collection,
      };

      expect(result).toEqual(expectedResult);
      expect(sSetCollectionPublicMock).toHaveBeenCalledTimes(1);
      expect(sSetCollectionPublicMock).toHaveBeenCalledWith(
         user.id,
         collection.id,
         true
      );
   });

   it("isPublic false - collection set private - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collection = dtestData.dCollection();
      sSetCollectionPublicMock.mockResolvedValue(collection);

      const result = await setCollectionPublic(collection.id, false);

      const expectedResult: ActionResult<DCollection> = {
         success: true,
         message: "Sammlung ist jetzt privat",
         data: collection,
      };

      expect(result).toEqual(expectedResult);
      expect(sSetCollectionPublicMock).toHaveBeenCalledTimes(1);
      expect(sSetCollectionPublicMock).toHaveBeenCalledWith(
         user.id,
         collection.id,
         false
      );
   });
});

describe("getTemplateCollectionIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getTemplateCollectionIds(invalidId);

      expect(result).toEqual([]);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetEntryCollectionIdsMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getTemplateCollectionIds(entryId);

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetEntryCollectionIdsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("collectionIds retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const collectionIds = dtestData.dCollectionIds();
      sGetEntryCollectionIdsMock.mockResolvedValue(collectionIds);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getTemplateCollectionIds(entryId);

      expect(result).toEqual(collectionIds);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetEntryCollectionIdsMock).toHaveBeenCalledTimes(1);
      expect(sGetEntryCollectionIdsMock).toHaveBeenCalledWith(user.id, entryId);
   });
});

describe("updateTemplateCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const collectionsId = dtestData.dCollectionIds();
      const result = await updateTemplateCollections(invalidId, collectionsId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlungen konnten nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateEntryCollectionsMock).not.toHaveBeenCalled();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";
      const collectionsId = dtestData.dCollectionIds();

      const result = await updateTemplateCollections(entryId, collectionsId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Sammlungen konnten nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateEntryCollectionsMock).not.toHaveBeenCalled();
   });

   it("success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sUpdateEntryCollectionsMock.mockResolvedValue();

      const entryId = "123e4567-e89b-12d3-a456-426614174000";
      const collectionsId = dtestData.dCollectionIds();

      const result = await updateTemplateCollections(entryId, collectionsId);

      const expectedResult: ActionResult = {
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

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const errorMessage = "DB Error";
      const error = new Error(errorMessage);
      sUpdateEntryCollectionsMock.mockRejectedValue(error);

      const entryId = "123e4567-e89b-12d3-a456-426614174000";
      const collectionsId = dtestData.dCollectionIds();

      const result = await updateTemplateCollections(entryId, collectionsId);

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
