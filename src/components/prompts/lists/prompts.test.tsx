jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getPrompts } from "@/data/actions/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { Prompts } from "./prompts";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

const assertRendered = () => {
   const prompts = screen.getByTestId("prompts-grid");
   assertInDocument(prompts);
};

describe("Prompts rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPrompt0sPage();
      getPromptsMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("Prompts - view grid - test", async () => {
      const { container } = renderWithRouter(
         <Prompts
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
