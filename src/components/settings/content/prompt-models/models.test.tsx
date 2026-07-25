jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";

import { getPromptModelsWithUsage } from "@/data/actions/prompt";

import { Models } from "./models";

const getModelsWithUsageMock = getPromptModelsWithUsage as jest.MockedFunction<
   typeof getPromptModelsWithUsage
>;

const assertRendered = () => {
   const models = screen.getByTestId("prompt-models");
   const createBtn = screen.getByTestId("create-model-btn");

   assertInDocument(models);
   assertInDocument(createBtn);
};

const assertModelsRendered = () => {
   const modelItems = screen.getAllByTestId("model-item");
   expect(modelItems).toHaveLength(3);
};

const assertEmptyStateRendered = () => {
   const empty = screen.getByTestId("models-empty");
   assertInDocument(empty);
};

const assertEmptyStateNotRendered = () => {
   const empty = screen.queryByTestId("models-empty");
   assertNotInDocument(empty);
};

describe("Models rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("models empty - test", async () => {
      getModelsWithUsageMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(Models, {});

      await waitFor(() => {
         assertRendered();
         assertEmptyStateRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("models retrieved - test", async () => {
      const models = dtestData.dPromptModelsWithUsage();
      getModelsWithUsageMock.mockResolvedValue(models);

      const { container } = await renderAsyncRSC(Models, {});

      await waitFor(() => {
         assertRendered();
         assertModelsRendered();
         assertEmptyStateNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
