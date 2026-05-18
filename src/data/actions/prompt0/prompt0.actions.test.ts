jest.mock("@/data/services/prompt0");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { Prompt0Service } from "@/data/services/prompt0";
import { DPrompt0sPageQuery } from "@/data/types/domain/prompt0";
import { ActionResult } from "@/data/types/utils";

import {
   createPrompt0,
   deletePrompt0,
   getPrompt0,
   getPrompt0Categories,
   getPrompt0s,
   toggleFavorite,
   updatePrompt0,
} from "./prompt0.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const sGetPrompt0s = Prompt0Service.prototype.getPrompt0s;
const sGetPrompt0 = Prompt0Service.prototype.getPrompt0;
const sGetPrompt0Categories = Prompt0Service.prototype.getPrompt0Categories;
const sCreatePrompt0 = Prompt0Service.prototype.createPrompt0;
const sUpdatePrompt0 = Prompt0Service.prototype.updatePrompt0;
const sDeletePrompt0 = Prompt0Service.prototype.deletePrompt0;
const sToggleFavorite = Prompt0Service.prototype.toggleFavorite;

const sGetPrompt0sMock = sGetPrompt0s as jest.MockedFunction<
   typeof sGetPrompt0s
>;
const sGetPrompt0Mock = sGetPrompt0 as jest.MockedFunction<typeof sGetPrompt0>;
const sGetPrompt0CategoriesMock = sGetPrompt0Categories as jest.MockedFunction<
   typeof sGetPrompt0Categories
>;
const sCreatePrompt0Mock = sCreatePrompt0 as jest.MockedFunction<
   typeof sCreatePrompt0
>;
const sUpdatePrompt0Mock = sUpdatePrompt0 as jest.MockedFunction<
   typeof sUpdatePrompt0
>;
const sDeletePrompt0Mock = sDeletePrompt0 as jest.MockedFunction<
   typeof sDeletePrompt0
>;
const sToggleFavoriteMock = sToggleFavorite as jest.MockedFunction<
   typeof sToggleFavorite
>;

describe("getPrompt0s tests", () => {
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

      const result = await getPrompt0s();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0sMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("query undefined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPrompt0sMock.mockResolvedValue(page);

      const result = await getPrompt0s();

      expect(result).toEqual(page);
      expect(sGetPrompt0sMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0sMock).toHaveBeenCalledWith(user.id, undefined);
   });

   it("query empty - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPrompt0sMock.mockResolvedValue(page);

      const query: DPrompt0sPageQuery = {};
      const result = await getPrompt0s(query);

      expect(result).toEqual(page);
      expect(sGetPrompt0sMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0sMock).toHaveBeenCalledWith(user.id, query);
   });

   it("query defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPrompt0sMock.mockResolvedValue(page);

      const query = dtestData.dPrompt0sPageQuery();
      const result = await getPrompt0s(query);

      expect(result).toEqual(page);
      expect(sGetPrompt0sMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0sMock).toHaveBeenCalledWith(user.id, query);
   });
});

describe("getPrompt0Categories tests", () => {
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

      const result = await getPrompt0Categories();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0CategoriesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("categories retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories = dtestData.dPrompt0CategoriesString();
      sGetPrompt0CategoriesMock.mockResolvedValue(categories);

      const result = await getPrompt0Categories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0CategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0CategoriesMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getPrompt0 tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getPrompt0(invalidId);

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetPrompt0Mock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Prompt ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt0(promptId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0Mock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("promt undefined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetPrompt0Mock.mockResolvedValue(null);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt0(promptId);

      expect(result).toBeNull();
      expect(sGetPrompt0Mock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0Mock).toHaveBeenCalledWith(user.id, promptId);
   });

   it("product defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPrompt0();
      sGetPrompt0Mock.mockResolvedValue(prompt);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt0(id);

      expect(result).toEqual(prompt);
      expect(sGetPrompt0Mock).toHaveBeenCalledTimes(1);
      expect(sGetPrompt0Mock).toHaveBeenCalledWith(user.id, id);
   });
});

describe("createPrompt0 tests", () => {
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
      const prompt = dtestData.dPrompt0Update();

      const result = await createPrompt0(prompt);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePrompt0Mock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPrompt0Update();
      sCreatePrompt0Mock.mockRejectedValue(new Error("db error"));

      const result: ActionResult = await createPrompt0(prompt);
      const expectedResult = {
         success: false,
         message: "Prompt konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePrompt0Mock).toHaveBeenCalledTimes(1);
      expect(sCreatePrompt0Mock).toHaveBeenCalledWith(user.id, prompt);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("prompt0 created  - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCreatePrompt0Mock.mockResolvedValue();

      const prompt = dtestData.dPrompt0Update();

      const result = await createPrompt0(prompt);
      const expectedResult: ActionResult = {
         success: true,
         message: "Prompt erfolgreich erstellt.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePrompt0Mock).toHaveBeenCalledTimes(1);
      expect(sCreatePrompt0Mock).toHaveBeenCalledWith(user.id, prompt);
   });
});

describe("updatePrompt0 tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt0(invalidId, prompt, false);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sUpdatePrompt0Mock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Prompt ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt0(promptId, prompt, false);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePrompt0Mock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompt0 updated - createVersion false - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt0(promptId, prompt, false);
      const expectedResult = {
         success: true,
         message: "Prompt erfolgreich aktualisiert.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePrompt0Mock).toHaveBeenCalledTimes(1);
      expect(sUpdatePrompt0Mock).toHaveBeenCalledWith(
         user.id,
         promptId,
         prompt,
         false
      );
   });

   it("prompt0 updated - createVersion true - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt0(promptId, prompt, true);
      const expectedResult = {
         success: true,
         message: "Prompt erfolgreich aktualisiert.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePrompt0Mock).toHaveBeenCalledTimes(1);
      expect(sUpdatePrompt0Mock).toHaveBeenCalledWith(
         user.id,
         promptId,
         prompt,
         true
      );
   });
});

describe("deletePrompt0 tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deletePrompt0(invalidId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sDeletePrompt0Mock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Prompt ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await deletePrompt0(promptId);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht gelöscht werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeletePrompt0Mock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("prompt0 deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await deletePrompt0(promptId);
      const expectedResult: ActionResult = {
         success: true,
         message: "Prompt erfolgreich gelöscht.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sDeletePrompt0Mock).toHaveBeenCalledTimes(1);
      expect(sDeletePrompt0Mock).toHaveBeenCalledWith(user.id, promptId);
   });
});

describe("toggleFavorite tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await toggleFavorite(invalidId, true);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sToggleFavoriteMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Prompt ID.");
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await toggleFavorite(promptId, true);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht aktualisiert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("add to favorites - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await toggleFavorite(promptId, true);
      const expectedResult = {
         success: true,
         message: "Zu Favoriten hinzugefügt",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(user.id, promptId, true);
   });

   it("remove from favorites - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await toggleFavorite(promptId, false);
      const expectedResult = {
         success: true,
         message: "Aus Favoriten entfernt",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(
         user.id,
         promptId,
         false
      );
   });
});
