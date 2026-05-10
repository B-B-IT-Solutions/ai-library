import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { ExploreNotFound } from "./not-found";

const assertRendered = () => {
   const notFound = screen.getByTestId("explore-not-found");
   const homeLink = screen.getByTestId("home-link");

   assertInDocument(notFound);
   assertInDocument(homeLink);
};

describe("ExploreNotFound rendering tests", () => {
   it("render - test", async () => {
      const { container } = render(<ExploreNotFound />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ExploreNotFound functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("render - test", async () => {
      render(<ExploreNotFound />);

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
