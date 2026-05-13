jest.mock("@/data/services/prompt");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { PromptService } from "@/data/services/prompt";
import { DPrompt0sPageQuery } from "@/data/types/domain/prompt0";
import { ActionResult } from "@/data/types/utils";

import {
   createPrompt,
   deletePrompt,
   getPrompt,
   getPromptCategories,
   getPrompts,
   toggleFavorite,
   updatePrompt,
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

describe("getPromptss tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getPrompts - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPrompts();

      expect(result).toEqual(EMPTY_PAGE);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getPrompts - query undefined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPromptsMock.mockResolvedValue(page);

      const result = await getPrompts();

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, undefined);
   });

   it("getPrompts - query empty - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query: DPrompt0sPageQuery = {};
      const result = await getPrompts(query);

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, query);
   });

   it("getPrompts - query defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPrompt0sPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();
      const result = await getPrompts(query);

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, query);
   });
});

describe("getPromptCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getPromptCategories - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const result = await getPromptCategories();

      expect(result).toEqual([]);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("getPromptCategories test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const categories = dtestData.dPromptCategoriesString();
      sGetPromptCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptCategories();

      expect(result).toEqual(categories);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("getPrompt - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await getPrompt(invalidId);

      expect(result).toBeNull();
      expect(requireUserMock).not.toHaveBeenCalled();
      expect(sGetPromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Invalid Prompt ID.");
   });

   it("getPrompt - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(promptId);

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("getPrompt  - promt undefined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sGetPromptMock.mockResolvedValue(null);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(promptId);

      expect(result).toBeNull();
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(user.id, promptId);
   });

   it("getPrompt  - product defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPrompt0();
      sGetPromptMock.mockResolvedValue(prompt);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(id);

      expect(result).toEqual(prompt);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(user.id, id);
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("createPrompt - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);
      const prompt = dtestData.dPrompt0Update();

      const result = await createPrompt(prompt);

      const expectedResult: ActionResult = {
         success: false,
         message: "Prompt konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("createPrompt - error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const prompt = dtestData.dPrompt0Update();
      sCreatePromptMock.mockRejectedValue(new Error("db error"));

      const result: ActionResult = await createPrompt(prompt);
      const expectedResult = {
         success: false,
         message: "Prompt konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, prompt);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("createPrompt - prompt created  - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCreatePromptMock.mockResolvedValue();

      const prompt = dtestData.dPrompt0Update();

      const result = await createPrompt(prompt);
      const expectedResult: ActionResult = {
         success: true,
         message: "Prompt erfolgreich erstellt.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, prompt);
   });
});

describe("updatePrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("updatePrompt - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt(invalidId, prompt, false);

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

   it("updatePrompt - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt(promptId, prompt, false);

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

   it("updatePrompt - prompt updated - createVersion false - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt(promptId, prompt, false);
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

   it("updatePrompt - prompt updated - createVersion true - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();

      const result = await updatePrompt(promptId, prompt, true);
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

   it("toggleFavorite - invalid UUID - test", async () => {
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

   it("toggleFavorite - user undefined - test", async () => {
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

   it("toggleFavorite - add to favorites - test", async () => {
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

   it("toggleFavorite - remove from favorites - test", async () => {
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

describe("deletePrompt tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("deletePrompt - invalid UUID - test", async () => {
      const invalidId = "invalid-uuid-1";

      const result = await deletePrompt(invalidId);

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

   it("deletePrompt - user undefined - test", async () => {
      const error = new Error("Unknow user");
      requireUserMock.mockRejectedValue(error);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await deletePrompt(promptId);

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

   it("deletePrompt - prompt deleted - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await deletePrompt(promptId);
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
