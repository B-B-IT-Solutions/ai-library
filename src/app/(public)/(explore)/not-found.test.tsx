import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { PreviewNotFound } from "./not-found";

const assertRendered = () => {
   const notFound = screen.getByTestId("preview-not-found");
   const homeLink = screen.getByTestId("home-link");

   assertInDocument(notFound);
   assertInDocument(homeLink);
};

describe("PreviewNotFound rendering tests", () => {
   it("render - test", async () => {
      const { container } = render(<PreviewNotFound />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PreviewNotFound functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("render - test", async () => {
      render(<PreviewNotFound />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const homeLink = screen.getByTestId("home-link");
      userEvent.click(homeLink);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.asPath).toEqual("/explore");
      });
   });
});
