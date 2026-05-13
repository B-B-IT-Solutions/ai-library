jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getPrompts } from "@/data/actions/prompt";

import { PromptsDashboard } from "./prompts-dashboard";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

const assertRendered = () => {
   const dashboard = screen.getByTestId("prompts-dashboard");
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   const toolbar = screen.getByTestId("prompts-toolbar");
   const prompts = screen.getByTestId("prompts-grid");

   assertInDocument(dashboard);
   assertInDocument(createPromptBtn);
   assertInDocument(toolbar);
   assertInDocument(prompts);
};

describe("PromptsDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPrompt0sPage();
      getPromptsMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptsDashboard rendered test", async () => {
      const { container } = await renderAsyncRSC(PromptsDashboard, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
