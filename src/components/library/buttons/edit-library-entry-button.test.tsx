import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { EditLibraryEntryButton } from "./edit-library-entry-button";

const assertRendered = () => {
   const editBtn = screen.getByTestId("edit-entry-btn");
   assertInDocument(editBtn);
};

describe("EditLibraryEntryButton rendering tests", () => {
   it("EditLibraryEntryButton rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      const { container } = renderWithRouter(
         <EditLibraryEntryButton entry={entry} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditLibraryEntryButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("EditLibraryEntryButton - edit btn clicked - test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      renderWithRouter(<EditLibraryEntryButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const editBtn = screen.getByTestId("edit-entry-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/library/${entry.id}/edit`);
      });
   });
});
