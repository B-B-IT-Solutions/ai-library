import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { ViewPlansLink } from "./view-plans-link";

const assertRendered = () => {
   const link = screen.getByTestId("view-plans-link");
   assertInDocument(link);
};

describe("ViewPlansLink rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("ViewPlansLink rendered test", async () => {
      const { container } = render(<ViewPlansLink />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ViewPlansLink functionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("ViewPlansLink - btn clicked - test", async () => {
      render(<ViewPlansLink />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("view-plans-link");
      userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/subscription/pricing");
      });
   });
});
