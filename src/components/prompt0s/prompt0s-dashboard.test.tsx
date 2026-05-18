jest.mock("@/data/actions/prompt0");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getPrompt0s } from "@/data/actions/prompt0";

import { Prompt0sDashboard } from "./prompt0s-dashboard";

const getPrompt0sMock = getPrompt0s as jest.MockedFunction<typeof getPrompt0s>;

const assertRendered = () => {
   const dashboard = screen.getByTestId("prompt0s-dashboard");
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   const toolbar = screen.getByTestId("prompts-toolbar");
   const prompts = screen.getByTestId("prompts-grid");

   assertInDocument(dashboard);
   assertInDocument(createPromptBtn);
   assertInDocument(toolbar);
   assertInDocument(prompts);
};

describe("Prompt0sDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPrompt0sPage();
      getPrompt0sMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      const { container } = await renderAsyncRSC(Prompt0sDashboard, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
