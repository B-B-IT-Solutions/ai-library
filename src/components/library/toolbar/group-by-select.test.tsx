import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { GroupBySelect } from "./group-by-select";

const assertRendered = () => {
   const select = screen.getByTestId("group-by-select");
   assertInDocument(select);
};

describe("GroupBySelect rendering tests", () => {
   it("GroupBySelect - groupBy GroupBySelect - test", async () => {
      const { container } = render(<GroupBySelect currentGroupBy="none" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GroupBySelect - groupBy date - test", async () => {
      const { container } = render(<GroupBySelect currentGroupBy="date" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GroupBySelect - groupBy model - test", async () => {
      const { container } = render(<GroupBySelect currentGroupBy="model" />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("GroupBySelect functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GroupBySelect - option category selected - test", async () => {
      const url = "/library";
      renderWithRouter(<GroupBySelect currentGroupBy="none" />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const select = screen.getByTestId("group-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const categoryOption = screen.getByTestId("category");
         assertInDocument(categoryOption);
         expect(mockRouter.pathname).toEqual(url);
      });

      const categoryOption = screen.getByTestId("category");
      userEvent.click(categoryOption);

      await waitFor(() => {
         expect(mockRouter.replace).toHaveBeenCalledTimes(1);
         expect(mockRouter.replace).toHaveBeenCalledWith(
            `${url}?group=category`
         );
      });
   });

   it("GroupBySelect - option model selected - test", async () => {
      const url = "/library";
      renderWithRouter(<GroupBySelect currentGroupBy="none" />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const select = screen.getByTestId("group-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const modelOption = screen.getByTestId("model");
         assertInDocument(modelOption);
         expect(mockRouter.pathname).toEqual(url);
      });

      const modelOption = screen.getByTestId("model");
      userEvent.click(modelOption);

      await waitFor(() => {
         expect(mockRouter.replace).toHaveBeenCalledTimes(1);
         expect(mockRouter.replace).toHaveBeenCalledWith(`${url}?group=model`);
      });
   });
});
