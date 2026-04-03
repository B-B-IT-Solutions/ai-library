jest.mock("@/data/services/library");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { LibraryService } from "@/data/services/library";
import { DLibraryCollection } from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

import {
   composePromptFromTemplate,
   createLibraryCollection,
   deleteLibraryCollection,
   downloadTemplate,
   getEntryCollectionIds,
   getLibraryCategories,
   getLibraryCollections,
   getLibraryModels,
   toggleLibraryEntryFavorite,
   updateEntryCollections,
   updateLibraryCollection,
} from "./library.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sComposePromptFromTemplate =
   LibraryService.prototype.composePromptFromTemplate;
const sDownloadTemplate = LibraryService.prototype.downloadPromptTemplate;
const sGetLibraryCategories = LibraryService.prototype.getLibraryCategories;
const sGetLibraryModels = LibraryService.prototype.getLibraryModels;
const sToggleFavorite = LibraryService.prototype.toggleFavorite;
const sGetCollections = LibraryService.prototype.getCollections;
const sCreateCollection = LibraryService.prototype.createCollection;
const sUpdateCollection = LibraryService.prototype.updateCollection;
const sDeleteCollection = LibraryService.prototype.deleteCollection;
const sGetEntryCollectionIds = LibraryService.prototype.getEntryCollectionIds;
const sUpdateEntryCollections = LibraryService.prototype.updateEntryCollections;

const sComposePromptFromTemplateMock =
   sComposePromptFromTemplate as jest.MockedFunction<
      typeof sComposePromptFromTemplate
   >;
const sDownloadTemplateMock = sDownloadTemplate as jest.MockedFunction<
   typeof sDownloadTemplate
>;
const sGetLibraryCategoriesMock = sGetLibraryCategories as jest.MockedFunction<
   typeof sGetLibraryCategories
>;
const sGetLibraryModelsMock = sGetLibraryModels as jest.MockedFunction<
   typeof sGetLibraryModels
>;
const sToggleFavoriteMock = sToggleFavorite as jest.MockedFunction<
   typeof sToggleFavorite
>;
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

describe("composePromptFromTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("composePromptFromTemplate - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const fieldValues: DPromptTemplateFieldValues = { field1: "value1" };

      const result = await composePromptFromTemplate(invalidId, fieldValues);

      const expectedResult: ActionResult = {
         success: false,
         message: "Invalid template ID.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sComposePromptFromTemplateMock).not.toHaveBeenCalled();
   });

   it("composePromptFromTemplate - user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptTemplateFieldValues = { field1: "value1" };
      requireUserMock.mockRejectedValue(error);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult = {
         success: false,
         message: "Unknow user",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).not.toHaveBeenCalled();
   });

   it("composePromptFromTemplate - success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptTemplateFieldValues = {
         name: "User-1 Name",
         email: "test1@email.com",
         age: 30,
      };
      const promptData = dtestData.dPromptUpdate();
      sComposePromptFromTemplateMock.mockResolvedValue(promptData);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };

      expect(result).toEqual(expectedResult);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledWith(
         templateId,
         fieldValues,
         user.id
      );
   });

   it("composePromptFromTemplate - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      const fieldValues: DPromptTemplateFieldValues = {
         name: "User-1 Name",
         email: "invalid-email",
      };
      const errorMessage = "Provided template fields are invalid";
      const error = new Error(errorMessage);
      sComposePromptFromTemplateMock.mockRejectedValue(error);

      const result = await composePromptFromTemplate(templateId, fieldValues);
      const expectedResult: ActionResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledTimes(1);
      expect(sComposePromptFromTemplateMock).toHaveBeenCalledWith(
         templateId,
         fieldValues,
         user.id
      );
   });
});

describe("downloadTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("downloadTemplate - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const errorMessage = "Invalid template ID.";

      const result = await downloadTemplate(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDownloadTemplateMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });

   it("downloadTemplate - user undefined - test", async () => {
      const error = new Error("Unknow user");
      const templateId = "123e4567-e89b-12d3-a456-426614174000";
      requireUserMock.mockRejectedValue(error);

      const result = await downloadTemplate(templateId);
      const expectedResult = {
         success: false,
         message: "Unknow user",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).not.toHaveBeenCalled();
   });

   it("downloadTemplate - success - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const downloadData = "template content data";
      sDownloadTemplateMock.mockResolvedValue(downloadData);

      const result = await downloadTemplate(descriptorId);
      const expectedResult = {
         success: true,
         message: "Template ready for download.",
         data: downloadData,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledWith(user.id, descriptorId);
   });

   it("downloadTemplate - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const errorMessage = "Template not found";
      const error = new Error(errorMessage);
      sDownloadTemplateMock.mockRejectedValue(error);

      const result = await downloadTemplate(descriptorId);
      const expectedResult = {
         success: false,
         message: errorMessage,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledTimes(1);
      expect(sDownloadTemplateMock).toHaveBeenCalledWith(user.id, descriptorId);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(errorMessage);
   });
});

describe("getLibraryCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getLibraryCategories - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getLibraryCategories();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetLibraryCategoriesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getLibraryCategories - categories retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories = dtestData.dTemplateCategories();
      sGetLibraryCategoriesMock.mockResolvedValue(categories);

      const result = await getLibraryCategories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetLibraryCategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetLibraryCategoriesMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getLibraryModels tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getLibraryModels - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getLibraryModels();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetLibraryModelsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getLibraryModels - models retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const models = dtestData.dTemplateModels();
      sGetLibraryModelsMock.mockResolvedValue(models);

      const result = await getLibraryModels();

      expect(result).toEqual(models);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetLibraryModelsMock).toHaveBeenCalledTimes(1);
      expect(sGetLibraryModelsMock).toHaveBeenCalledWith(user.id);
   });
});

describe("toggleLibraryEntryFavorite tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("toggleLibraryEntryFavorite - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const isFavorite = true;

      const result = await toggleLibraryEntryFavorite(invalidId, isFavorite);

      const expectedResult: ActionResult = {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sToggleFavoriteMock).not.toHaveBeenCalled();
   });

   it("toggleLibraryEntryFavorite - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = true;

      const result = await toggleLibraryEntryFavorite(descriptorId, isFavorite);
      const expectedResult: ActionResult = {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).not.toHaveBeenCalled();
   });

   it("toggleLibraryEntryFavorite - success - isFavoriete true - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = true;

      sToggleFavoriteMock.mockResolvedValue();

      const result = await toggleLibraryEntryFavorite(descriptorId, isFavorite);
      const expectedResult: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Zu Favoriten hinzugefügt",
      };

      expect(result).toEqual(expectedResult);
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(
         descriptorId,
         user.id,
         isFavorite
      );
   });

   it("toggleLibraryEntryFavorite - success - isFavoriete false - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = false;

      sToggleFavoriteMock.mockResolvedValue();

      const result = await toggleLibraryEntryFavorite(descriptorId, isFavorite);
      const expectedResult: ActionResult<DPromptUpdate> = {
         success: true,
         message: "Aus Favoriten entfernt",
      };

      expect(result).toEqual(expectedResult);
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(
         descriptorId,
         user.id,
         isFavorite
      );
   });

   it("toggleLibraryEntryFavorite - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const errorMessage = "Provided entryId couldn't be found";
      const error = new Error(errorMessage);
      sToggleFavoriteMock.mockRejectedValue(error);

      const descriptorId = "123e4567-e89b-12d3-a456-426614174000";
      const isFavorite = false;

      const result = await toggleLibraryEntryFavorite(descriptorId, isFavorite);
      const expectedResult: ActionResult = {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(
         descriptorId,
         user.id,
         isFavorite
      );
   });
});

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

   it("updateLibraryCollection - user undefined - test", async () => {
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

   it("updateLibraryCollection - success - test", async () => {
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
         collectionId,
         user.id,
         data
      );
   });

   it("updateLibraryCollection - error - test", async () => {
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
         collectionId,
         user.id,
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

   it("deleteLibraryCollection - invalid UUID - test", async () => {
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

   it("deleteLibraryCollection - user undefined - test", async () => {
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

   it("deleteLibraryCollection - success - test", async () => {
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
      expect(sDeleteCollectionMock).toHaveBeenCalledWith(collectionId, user.id);
   });

   it("deleteLibraryCollection - error - test", async () => {
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
      expect(sDeleteCollectionMock).toHaveBeenCalledWith(collectionId, user.id);
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
