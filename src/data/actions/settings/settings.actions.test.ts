jest.mock("@/data/services/settings");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { SettingsService } from "@/data/services/settings";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

import {
   createGlobalField,
   deleteGlobalField,
   getGlobalFields,
   updateGlobalField,
} from "./settings.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetGlobalTemplateFields =
   SettingsService.prototype.getGlobalTemplateFields;
const sCreateGlobalTemplateField =
   SettingsService.prototype.createGlobalTemplateField;
const sUpdateGlobalTemplateField =
   SettingsService.prototype.updateGlobalTemplateField;
const sDeleteGlobalTemplateField =
   SettingsService.prototype.deleteGlobalTemplateField;

const sGetGlobalTemplateFieldsMock =
   sGetGlobalTemplateFields as jest.MockedFunction<
      typeof sGetGlobalTemplateFields
   >;
const sCreateGlobalTemplateFieldMock =
   sCreateGlobalTemplateField as jest.MockedFunction<
      typeof sCreateGlobalTemplateField
   >;
const sUpdateGlobalTemplateFieldMock =
   sUpdateGlobalTemplateField as jest.MockedFunction<
      typeof sUpdateGlobalTemplateField
   >;
const sDeleteGlobalTemplateFieldMock =
   sDeleteGlobalTemplateField as jest.MockedFunction<
      typeof sDeleteGlobalTemplateField
   >;

describe("getGlobalFields tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getGlobalFields - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getGlobalFields();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetGlobalTemplateFieldsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getGlobalFields - fields retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const fields = dtestData.dGlobalTemplateFields();
      sGetGlobalTemplateFieldsMock.mockResolvedValue(fields);

      const result = await getGlobalFields();

      expect(result).toEqual(fields);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetGlobalTemplateFieldsMock).toHaveBeenCalledTimes(1);
      expect(sGetGlobalTemplateFieldsMock).toHaveBeenCalledWith(user.id);
   });
});

describe("createGlobalField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("createGlobalField - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const data = dtestData.dGlobalTemplateFieldUpdate();
      const result = await createGlobalField(data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalTemplateFieldMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("createGlobalField - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sCreateGlobalTemplateFieldMock.mockRejectedValue(error);

      const data = dtestData.dGlobalTemplateFieldUpdate();
      const result = await createGlobalField(data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalTemplateFieldMock).toHaveBeenCalledWith(
         user.id,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("createGlobalField - field created - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const field = dtestData.dGlobalTemplateField();
      sCreateGlobalTemplateFieldMock.mockResolvedValue(field);

      const data = dtestData.dGlobalTemplateFieldUpdate();
      const result = await createGlobalField(data);

      const expectedResult: ActionResult<DGlobalTemplateField> = {
         success: true,
         message: "Feld erfolgreich erstellt",
         data: field,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
      expect(sCreateGlobalTemplateFieldMock).toHaveBeenCalledWith(
         user.id,
         data
      );
   });
});

describe("updateGlobalField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("updateGlobalField - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";
      const data = dtestData.dGlobalTemplateFieldUpdate();

      const result = await updateGlobalField(invalidId, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdateGlobalTemplateFieldMock).not.toHaveBeenCalled();
   });

   it("updateGlobalField - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";
      const data = dtestData.dGlobalTemplateFieldUpdate();

      const result = await updateGlobalField(id, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalTemplateFieldMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("updateGlobalField - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sUpdateGlobalTemplateFieldMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";
      const data = dtestData.dGlobalTemplateFieldUpdate();

      const result = await updateGlobalField(id, data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalTemplateFieldMock).toHaveBeenCalledWith(
         user.id,
         id,
         data
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("updateGlobalField - field updated - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const field = dtestData.dGlobalTemplateField();
      sUpdateGlobalTemplateFieldMock.mockResolvedValue(field);

      const id = "123e4567-e89b-12d3-a456-426614174000";
      const data = dtestData.dGlobalTemplateFieldUpdate();

      const result = await updateGlobalField(id, data);

      const expectedResult: ActionResult<DGlobalTemplateField> = {
         success: true,
         message: "Feld erfolgreich aktualisiert",
         data: field,
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
      expect(sUpdateGlobalTemplateFieldMock).toHaveBeenCalledWith(
         user.id,
         id,
         data
      );
   });
});

describe("deleteGlobalField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("deleteGlobalField - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deleteGlobalField(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeleteGlobalTemplateFieldMock).not.toHaveBeenCalled();
   });

   it("deleteGlobalField - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteGlobalField(id);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalTemplateFieldMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("deleteGlobalField - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const error = new Error("db error");
      sDeleteGlobalTemplateFieldMock.mockRejectedValue(error);

      const id = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteGlobalField(id);

      const expectedResult: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalTemplateFieldMock).toHaveBeenCalledWith(user.id, id);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("deleteGlobalField - field deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sDeleteGlobalTemplateFieldMock.mockResolvedValue();

      const id = "123e4567-e89b-12d3-a456-426614174000";

      const result = await deleteGlobalField(id);

      const expectedResult: ActionResult = {
         success: true,
         message: "Feld erfolgreich gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
      expect(sDeleteGlobalTemplateFieldMock).toHaveBeenCalledWith(user.id, id);
   });
});
