jest.mock("@/data/services/prompt0");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { PromptService } from "@/data/services/prompt0";
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

const sGetPrompts = PromptService.prototype.getPrompts;
const sGetPrompt = PromptService.prototype.getPrompt;
const sGetPromptCategories = PromptService.prototype.getPromptCategories;
const sCreatePrompt = PromptService.prototype.createPrompt;
const sUpdatePrompt = PromptService.prototype.updatePrompt;
const sDeletePrompt = PromptService.prototype.deletePrompt;
const sToggleFavorite = PromptService.prototype.toggleFavorite;

const sGetPromptsMock = sGetPrompts as jest.MockedFunction<typeof sGetPrompts>;
const sGetPromptMock = sGetPrompt as jest.MockedFunction<typeof sGetPrompt>;
const sGetPromptCategoriesMock = sGetPromptCategories as jest.MockedFunction<
   typeof sGetPromptCategories
>;
const sCreatePromptMock = sCreatePrompt as jest.MockedFunction<
   typeof sCreatePrompt
>;
const sUpdatePromptMock = sUpdatePrompt as jest.MockedFunction<
   typeof sUpdatePrompt
>;
const sDeletePromptMock = sDeletePrompt as jest.MockedFunction<
   typeof sDeletePrompt
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
      expect(sGetPromptsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("query undefined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPromptsMock.mockResolvedValue(page);

      const result = await getPrompt0s();

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, undefined);
   });

   it("query empty - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query: DPrompt0sPageQuery = {};
      const result = await getPrompt0s(query);

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, query);
   });

   it("query defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query = dtestData.dPrompt0sPageQuery();
      const result = await getPrompt0s(query);

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, query);
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
      expect(sGetPromptCategoriesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("categories retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories = dtestData.dPrompt0CategoriesString();
      sGetPromptCategoriesMock.mockResolvedValue(categories);

      const result = await getPrompt0Categories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledWith(user.id);
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
      expect(sGetPromptMock).not.toHaveBeenCalled();
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
      expect(sGetPromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("promt undefined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetPromptMock.mockResolvedValue(null);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt0(promptId);

      expect(result).toBeNull();
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(user.id, promptId);
   });

   it("product defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPrompt0();
      sGetPromptMock.mockResolvedValue(prompt);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt0(id);

      expect(result).toEqual(prompt);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(user.id, id);
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
      expect(sCreatePromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPrompt0Update();
      sCreatePromptMock.mockRejectedValue(new Error("db error"));

      const result: ActionResult = await createPrompt0(prompt);
      const expectedResult = {
         success: false,
         message: "Prompt konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, prompt);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("prompt0 created  - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCreatePromptMock.mockResolvedValue();

      const prompt = dtestData.dPrompt0Update();

      const result = await createPrompt0(prompt);
      const expectedResult: ActionResult = {
         success: true,
         message: "Prompt erfolgreich erstellt.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, prompt);
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
      expect(sUpdatePromptMock).not.toHaveBeenCalled();
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
      expect(sUpdatePromptMock).not.toHaveBeenCalled();
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
      expect(sUpdatePromptMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledWith(
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
      expect(sUpdatePromptMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledWith(
         user.id,
         promptId,
         prompt,
         true
      );
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
      expect(sDeletePromptMock).not.toHaveBeenCalled();
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
      expect(sDeletePromptMock).not.toHaveBeenCalled();
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
      expect(sDeletePromptMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).toHaveBeenCalledWith(user.id, promptId);
   });
});
