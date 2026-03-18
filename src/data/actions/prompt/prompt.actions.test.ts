jest.mock("@/data/services/prompt");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE } from "@/data/actions/utils";
import { PromptService } from "@/data/services/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";

import {
   createPrompt,
   deletePrompt,
   getPrompt,
   getPromptCategories,
   getPrompts,
   toggleFavorite,
   updatePrompt,
} from "./prompt.actions";

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

const revalidatePathMock = revalidatePath as jest.MockedFunction<
   typeof revalidatePath
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

      const page = dtestData.dPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const result = await getPrompts();

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, undefined);
   });

   it("getPrompts - query empty - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPromptDescriptorsPage();
      sGetPromptsMock.mockResolvedValue(page);

      const query: DPromptDescriptorsPageQuery = {};
      const result = await getPrompts(query);

      expect(result).toEqual(page);
      expect(sGetPromptsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptsMock).toHaveBeenCalledWith(user.id, query);
   });

   it("getPrompts - query defined - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const page = dtestData.dPromptDescriptorsPage();
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
      jest.resetAllMocks();
   });

   it("getPromptCategories test", async () => {
      const categories = dtestData.dPromptCategories();
      sGetPromptCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptCategories();
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(sGetPromptCategoriesMock).toHaveBeenCalledTimes(1);
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPrompt  - promt undefined - test", async () => {
      sGetPromptMock.mockResolvedValue(undefined);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(id);

      expect(result).toBeUndefined();
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(id);
   });

   it("getPrompt  - product defined - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      sGetPromptMock.mockResolvedValue(prompt);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await getPrompt(id);

      expect(result).toEqual(prompt);
      expect(sGetPromptMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptMock).toHaveBeenCalledWith(id);
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
      const prompt = dtestData.dPromptUpdate();

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

      const prompt = dtestData.dPromptUpdate();
      sCreatePromptMock.mockRejectedValue(new Error("db error"));

      const result: ActionResult = await createPrompt(prompt);
      const expectedResult = {
         success: false,
         message: "Prompt konnte nicht erstellt werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreatePromptMock).toHaveBeenCalledTimes(1);
      expect(sCreatePromptMock).toHaveBeenCalledWith(user.id, prompt);
   });

   it("createPrompt - prompt created  - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCreatePromptMock.mockResolvedValue();

      const prompt = dtestData.dPromptUpdate();

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
      jest.resetAllMocks();
   });

   it("updatePrompt - error - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPromptUpdate();
      sUpdatePromptMock.mockRejectedValue(new Error("db error"));

      const result = await updatePrompt(id, prompt, false);
      const expectedResult = {
         success: false,
         message: "db error",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdatePromptMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledWith(id, prompt, false);
   });

   it("updatePrompt - prompt updated - createVersion false - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPromptUpdate();

      const result = await updatePrompt(id, prompt, false);
      const expectedResult = {
         success: true,
         message: "Prompt erfolgreich aktualisiert.",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdatePromptMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledWith(id, prompt, false);
   });

   it("updatePrompt - prompt updated - createVersion true - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPromptUpdate();

      const result = await updatePrompt(id, prompt, true);
      const expectedResult = {
         success: true,
         message: "Prompt erfolgreich aktualisiert.",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdatePromptMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePromptMock).toHaveBeenCalledWith(id, prompt, true);
   });
});

describe("toggleFavorite tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("toggleFavorite - error - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      sToggleFavoriteMock.mockRejectedValue(new Error("db error"));

      const result = await toggleFavorite(id, true);
      const expectedResult = {
         success: false,
         message: "db error",
      };

      expect(result).toEqual(expectedResult);
      expect(revalidatePathMock).not.toHaveBeenCalled();
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(id, true);
   });

   it("toggleFavorite - add to favorites - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await toggleFavorite(id, true);
      const expectedResult = {
         success: true,
         message: "Zu Favoriten hinzugefügt",
      };

      expect(result).toEqual(expectedResult);
      expect(revalidatePathMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(id, true);
   });

   it("toggleFavorite - remove from favorites - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await toggleFavorite(id, false);
      const expectedResult = {
         success: true,
         message: "Aus Favoriten entfernt",
      };

      expect(result).toEqual(expectedResult);
      expect(revalidatePathMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledTimes(1);
      expect(sToggleFavoriteMock).toHaveBeenCalledWith(id, false);
   });
});

describe("deletePrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("deletePrompt - error - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      sDeletePromptMock.mockRejectedValue(new Error("db error"));

      const result = await deletePrompt(id);
      const expectedResult = {
         success: false,
         message: "db error",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeletePromptMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).toHaveBeenCalledWith(id);
   });

   it("deletePrompt - prompt deleted - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      const result = await deletePrompt(id);
      const expectedResult = {
         success: true,
         message: "Prompt erfolgreich gelöscht.",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeletePromptMock).toHaveBeenCalledTimes(1);
      expect(sDeletePromptMock).toHaveBeenCalledWith(id);
   });
});
