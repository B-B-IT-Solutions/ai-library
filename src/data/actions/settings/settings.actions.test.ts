jest.mock("@/data/services/settings");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { SettingsService } from "@/data/services/settings";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

import {
   createGlobalPromptField,
   deleteGlobalPromptField,
   getGlobalPromptFields,
   updateGlobalPromptField,
} from "./settings.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetGlobalPromptFields =
   SettingsService.prototype.getGlobalPromptFields;
const sCreateGlobalPromptField =
   SettingsService.prototype.createGlobalPromptField;
const sUpdateGlobalPromptField =
   SettingsService.prototype.updateGlobalPromptField;
const sDeleteGlobalPromptField =
   SettingsService.prototype.deleteGlobalPromptField;

const sGetGlobalPromptFieldsMock =
   sGetGlobalPromptFields as jest.MockedFunction<
      typeof sGetGlobalPromptFields
   >;
const sCreateGlobalPromptFieldMock =
   sCreateGlobalPromptField as jest.MockedFunction<
      typeof sCreateGlobalPromptField
   >;
const sUpdateGlobalPromptFieldMock =
   sUpdateGlobalPromptField as jest.MockedFunction<
      typeof sUpdateGlobalPromptField
   >;
const sDeleteGlobalPromptFieldMock =
   sDeleteGlobalPromptField as jest.MockedFunction<
      typeof sDeleteGlobalPromptField
   >;

describe("getGlobalPromptFields tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getGlobalPromptFields - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getGlobalPromptFields();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetGlobalPromptFieldsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getGlobalPromptFields - fields retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const fields = dtestData.dGlobalPromptFields();
      sGetGlobalPromptFieldsMock.mockResolvedValue(fields);

      const result = await getGlobalPromptFields();

      expect(result).toEqual(fields);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetGlobalPromptFieldsMock).toHaveBeenCalledTimes(1);
      expect(sGetGlobalPromptFieldsMock).toHaveBeenCalledWith(user.id);
   });
});

describe("createGlobalPromptField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("createGlobalPromptField - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const data = dtestData.dGlobalPromptFieldUpdate();
      const result = await createGlobalPromptField(data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalPromptFieldMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("createGlobalPromptField - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sCreateGlobalPromptFieldMock.mockRejectedValue(error);

      const data = dtestData.dGlobalPromptFieldUpdate();
      const result = await createGlobalPromptField(data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalPromptFieldMock).toHaveBeenCalledWith(
         user.id,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("createGlobalPromptField - field created - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const field = dtestData.dGlobalPromptField();
      sCreateGlobalPromptFieldMock.mockResolvedValue(field);

      const data = dtestData.dGlobalPromptFieldUpdate();
      const result = await createGlobalPromptField(data);

      const expectedResult: ActionResult<DGlobalPromptField> = {
         success: true,
         message: "Feld erfolgreich erstellt",
         data: field,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalPromptFieldMock).toHaveBeenCalledWith(
         user.id,
         data
      );
   });
});

describe("updateGlobalPromptField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("updateGlobalPromptField - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const data = dtestData.dGlobalPromptFieldUpdate();

      const result = await updateGlobalPromptField(invalidId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateGlobalPromptFieldMock).not.toHaveBeenCalled();
   });

   it("updateGlobalPromptField - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";
      const data = dtestData.dGlobalPromptFieldUpdate();

      const result = await updateGlobalPromptField(id, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalPromptFieldMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("updateGlobalPromptField - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sUpdateGlobalPromptFieldMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";
      const data = dtestData.dGlobalPromptFieldUpdate();

      const result = await updateGlobalPromptField(id, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalPromptFieldMock).toHaveBeenCalledWith(
         user.id,
         id,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("updateGlobalPromptField - field updated - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const field = dtestData.dGlobalPromptField();
      sUpdateGlobalPromptFieldMock.mockResolvedValue(field);

      const id = "123e4567-e89b-12d3-a456-426614174000";
      const data = dtestData.dGlobalPromptFieldUpdate();

      const result = await updateGlobalPromptField(id, data);

      const expectedResult: ActionResult<DGlobalPromptField> = {
         success: true,
         message: "Feld erfolgreich aktualisiert",
         data: field,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalPromptFieldMock).toHaveBeenCalledWith(
         user.id,
         id,
         data
      );
   });
});

describe("deleteGlobalPromptField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("deleteGlobalPromptField - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deleteGlobalPromptField(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteGlobalPromptFieldMock).not.toHaveBeenCalled();
   });

   it("deleteGlobalPromptField - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteGlobalPromptField(id);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalPromptFieldMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("deleteGlobalPromptField - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sDeleteGlobalPromptFieldMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteGlobalPromptField(id);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalPromptFieldMock).toHaveBeenCalledWith(user.id, id);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("deleteGlobalPromptField - field deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sDeleteGlobalPromptFieldMock.mockResolvedValue();

      const id = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteGlobalPromptField(id);

      const expectedResult: ActionResult = {
         success: true,
         message: "Feld erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalPromptFieldMock).toHaveBeenCalledWith(user.id, id);
   });
});
