import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { DListViewMode } from "@/data/types/domain/common";

import { ListViewToggle } from "./list-view-toggle";

const assertRendered = () => {
   const viewToggle = screen.getByTestId("view-toggle");
   const gridBtn = screen.getByTestId("grid-view-btn");
   const listBtn = screen.getByTestId("list-view-btn");

   assertInDocument(viewToggle);
   assertInDocument(gridBtn);
   assertInDocument(listBtn);
};

describe("ListViewToggle rendering tests", () => {
   it("ListViewToggle - view grid - test", async () => {
      const { container } = render(
         <ListViewToggle currentView={DListViewMode.GRID} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ListViewToggle - view list - test", async () => {
      const { container } = render(
         <ListViewToggle currentView={DListViewMode.LIST} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ListViewToggle functinality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("ListViewToggle - list toggle clicked - test", async () => {
      const url = "/marketplace";
      renderWithRouter(
         <ListViewToggle currentView={DListViewMode.GRID} />,
         url
      );

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

   it("ListViewToggle - grid toggle clicked - test", async () => {
      const url = "/marketplace?view=list";
      renderWithRouter(
         <ListViewToggle currentView={DListViewMode.LIST} />,
         url
      );

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
