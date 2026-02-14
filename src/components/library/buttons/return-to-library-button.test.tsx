import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { ReturnToLibraryButton } from "./return-to-library-button";

const assertRendered = () => {
   const btn = screen.getByTestId("return-to-library-btn");
   assertInDocument(btn);
};

describe("ReturnToLibraryButton rendering tests", () => {
   it("ReturnToLibraryButton rendered test", async () => {
      const { container } = render(<ReturnToLibraryButton />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ReturnToLibraryButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("ReturnToLibraryButton - create btn clicked - test", async () => {
      render(<ReturnToLibraryButton />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const btn = screen.getByTestId("return-to-library-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/library");
      });
   });
});
