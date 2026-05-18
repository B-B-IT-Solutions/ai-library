jest.mock("@/data/repositories/prompt0");

import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { Prompt0Repository } from "@/data/repositories/prompt0";
import { DPrompt0sPageQuery } from "@/data/types/domain/prompt0";

import { Prompt0Service } from "./prompt0.service";

const prompt0Repo = new Prompt0Repository(prisma);
const prompt0RepoMock = prompt0Repo as DeepMockProxy<Prompt0Repository>;

const prompt0Service = new Prompt0Service(prompt0RepoMock);

describe("getPrompt0s tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("query undefined - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dPrompt0sPage();
      prompt0RepoMock.pGetPrompt0s.mockResolvedValue(page);

      const result = await prompt0Service.getPrompt0s(userId);

      expect(result).toEqual(page);
      expect(prompt0RepoMock.pGetPrompt0s).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0s).toHaveBeenCalledWith(
         userId,
         undefined
      );
   });

   it("query empty - test", async () => {
      const userId = "user-id-123";
      const page = dtestData.dPrompt0sPage();
      prompt0RepoMock.pGetPrompt0s.mockResolvedValue(page);

      const query: DPrompt0sPageQuery = {};
      const result = await prompt0Service.getPrompt0s(userId, query);

      expect(result).toEqual(page);
      expect(prompt0RepoMock.pGetPrompt0s).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0s).toHaveBeenCalledWith(userId, query);
   });

   it("query defined - test", async () => {
      const userId = "user-id-456";
      const page = dtestData.dPrompt0sPage();
      prompt0RepoMock.pGetPrompt0s.mockResolvedValue(page);

      const query = dtestData.dPrompt0sPageQuery();
      const result = await prompt0Service.getPrompt0s(userId, query);

      expect(result).toEqual(page);
      expect(prompt0RepoMock.pGetPrompt0s).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0s).toHaveBeenCalledWith(userId, query);
   });
});

describe("getPrompt0Categories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = dtestData.dPrompt0Categories();
      prompt0RepoMock.pGetPrompt0Categories.mockResolvedValue(categories);

      const result = await prompt0Service.getPrompt0Categories(userId);
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(prompt0RepoMock.pGetPrompt0Categories).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0Categories).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("getPrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt undefined - test", async () => {
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(null);

      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await prompt0Service.getPrompt0(userId, promptId);

      expect(result).toBeNull();
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
   });

   it("prompt defined - test", async () => {
      const prompt = dtestData.dPrompt0();
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(prompt);

      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await prompt0Service.getPrompt0(userId, promptId);

      expect(result).toEqual(prompt);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
   });
});

describe("createPrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("error - test", async () => {
      const userId = "user-id-123";
      const prompt = dtestData.dPrompt0Update();
      prompt0RepoMock.pCreatePrompt0.mockRejectedValue(new Error("db error"));

      await expect(
         prompt0Service.createPrompt0(userId, prompt)
      ).rejects.toThrow("db error");

      expect(prompt0RepoMock.pCreatePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pCreatePrompt0).toHaveBeenCalledWith(
         userId,
         prompt
      );
   });

   it("prompt0 created  - test", async () => {
      const userId = "user-id-456";
      const prompt = dtestData.dPrompt0Update();

      await prompt0Service.createPrompt0(userId, prompt);

      expect(prompt0RepoMock.pCreatePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pCreatePrompt0).toHaveBeenCalledWith(
         userId,
         prompt
      );
   });
});

describe("updatePrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt0 not found - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(null);

      const fn = async () =>
         prompt0Service.updatePrompt0(userId, promptId, prompt, false);

      await expect(fn).rejects.toThrow("Prompt not found");

      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(prompt0RepoMock.pUpdatePrompt0).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.currentVersion = 1;
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(currentPrompt);
      const error = new Error("db error");
      prompt0RepoMock.pUpdatePrompt0.mockRejectedValue(error);

      const fn = async () =>
         prompt0Service.updatePrompt0(userId, promptId, promptUpdate, true);

      await expect(fn).rejects.toThrow("db error");

      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         2,
         true
      );
   });

   it("content not changed - createVersion false - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.content = promptUpdate.content;
      currentPrompt.currentVersion = 1;
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(currentPrompt);

      await prompt0Service.updatePrompt0(userId, promptId, promptUpdate, false);

      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("content not changed - createVersion true - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.content = promptUpdate.content;
      currentPrompt.currentVersion = 1;
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(currentPrompt);

      await prompt0Service.updatePrompt0(userId, promptId, promptUpdate, true);

      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("content changed - createVersion false - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.currentVersion = 1;
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(currentPrompt);

      await prompt0Service.updatePrompt0(userId, promptId, promptUpdate, false);

      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("content changed - createVersion true - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.currentVersion = 1;
      prompt0RepoMock.pGetPrompt0.mockResolvedValue(currentPrompt);

      await prompt0Service.updatePrompt0(userId, promptId, promptUpdate, true);

      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pGetPrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pUpdatePrompt0).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         2,
         true
      );
   });
});

describe("deletePrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt0 deleted - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await prompt0Service.deletePrompt0(userId, promptId);

      expect(prompt0RepoMock.pDeletePrompt0).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pDeletePrompt0).toHaveBeenCalledWith(
         userId,
         promptId
      );
   });
});

describe("toggleFavorite tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("toggleFavorite - add to favorites - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await prompt0Service.toggleFavorite(userId, promptId, true);

      expect(prompt0RepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pToggleFavorite).toHaveBeenCalledWith(
         userId,
         promptId,
         true
      );
   });

   it("toggleFavorite - remove from favorites - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await prompt0Service.toggleFavorite(userId, promptId, false);

      expect(prompt0RepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(prompt0RepoMock.pToggleFavorite).toHaveBeenCalledWith(
         userId,
         promptId,
         false
      );
   });
});
