import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CreateLibraryEntryButton } from "./create-library-entry-button";

const assertRendered = () => {
   const btn = screen.getByTestId("create-library-entry-btn");
   assertInDocument(btn);
};

describe("CreateLibraryEntryButton rendering tests", () => {
   it("CreateLibraryEntryButton rendered test", async () => {
      const { container } = render(<CreateLibraryEntryButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateLibraryEntryButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("CreateLibraryEntryButton - create btn clicked - test", async () => {
      render(<CreateLibraryEntryButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("create-library-entry-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates/new");
      });
   });
});
