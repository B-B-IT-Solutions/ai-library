jest.mock("@/data/actions/prompt0");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getPrompt0s } from "@/data/actions/prompt0";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { Prompts } from "./prompts";

const getPrompt0sMock = getPrompt0s as jest.MockedFunction<typeof getPrompt0s>;

const assertRendered = () => {
   const prompts = screen.getByTestId("prompts-grid");
   assertInDocument(prompts);
};

describe("Prompts rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPrompt0sPage();
      getPrompt0sMock.mockResolvedValue(page);
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
