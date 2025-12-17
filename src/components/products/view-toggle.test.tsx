import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { ViewToggle } from "./view-toggle";

const assertRendered = () => {
   const viewToggle = screen.getByTestId("view-toggle");
   const gridBtn = screen.getByTestId("grid-view-btn");
   const listBtn = screen.getByTestId("list-view-btn");

   assertInDocument(viewToggle);
   assertInDocument(gridBtn);
   assertInDocument(listBtn);
};

describe("ViewToggle rendering tests", () => {
   it("ViewToggle - view grid - test", async () => {
      const { container } = render(<ViewToggle currentView="grid" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ViewToggle - view list - test", async () => {
      const { container } = render(<ViewToggle currentView="list" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ViewToggle functinality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("ViewToggle - list toggle clicked - test", async () => {
      const url = "/marketplace";
      renderWithRouter(<ViewToggle currentView="grid" />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const listBtn = screen.getByTestId("list-view-btn");
      userEvent.click(listBtn);

      await waitFor(() => {
         expect(mockRouter.replace).toHaveBeenCalledTimes(1);
         expect(mockRouter.replace).toHaveBeenCalledWith(`${url}?view=list`);
      });
   });

   it("ViewToggle - grid toggle clicked - test", async () => {
      const url = "/marketplace?view=list";
      renderWithRouter(<ViewToggle currentView="list" />, url);

      await waitFor(() => {
         assertRendered();
      });

      const gridBtn = screen.getByTestId("grid-view-btn");
      userEvent.click(gridBtn);

      await waitFor(() => {
         expect(mockRouter.replace).toHaveBeenCalledTimes(1);
         expect(mockRouter.replace).toHaveBeenCalledWith(
            "/marketplace?view=grid"
         );
      });
   });
});
