import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { SortBySelect } from "./sort-by-select";

const assertRendered = () => {
   const select = screen.getByTestId("sort-by-select");
   assertInDocument(select);
};

describe("SortBySelect rendering tests", () => {
   it("SortBySelect - sortBy date-asc - test", async () => {
      const { container } = render(<SortBySelect currentSortBy="date-asc" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SortBySelect - sortBy date-desc - test", async () => {
      const { container } = render(<SortBySelect currentSortBy="date-desc" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SortBySelect - sortBy name-asc - test", async () => {
      const { container } = render(<SortBySelect currentSortBy="name-asc" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SortBySelect functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("SortBySelect - option date-desc selected - test", async () => {
      const url = "/library";
      renderWithRouter(<SortBySelect currentSortBy="date-asc" />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const select = screen.getByTestId("sort-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("date-desc");
         assertInDocument(option);
         expect(mockRouter.pathname).toEqual(url);
      });

      const option = screen.getByTestId("date-desc");
      userEvent.click(option);

      await waitFor(() => {
         expect(mockRouter.replace).toHaveBeenCalledTimes(1);
         expect(mockRouter.replace).toHaveBeenCalledWith(
            `${url}?sort=date-desc`
         );
      });
   });

   it("SortBySelect - option name-asc selected - test", async () => {
      const url = "/library";
      renderWithRouter(<SortBySelect currentSortBy="date-desc" />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const select = screen.getByTestId("sort-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const option = screen.getByTestId("name-asc");
         assertInDocument(option);
         expect(mockRouter.pathname).toEqual(url);
      });

      const option = screen.getByTestId("name-asc");
      userEvent.click(option);

      await waitFor(() => {
         expect(mockRouter.replace).toHaveBeenCalledTimes(1);
         expect(mockRouter.replace).toHaveBeenCalledWith(
            `${url}?sort=name-asc`
         );
      });
   });
});
