import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { GroupBySelect } from "./group-by-select";

const assertRendered = () => {
   const select = screen.getByTestId("group-by-select");
   assertInDocument(select);
};

describe("GroupBySelect rendering tests", () => {
   it("GroupBySelect - groupBy none - test", async () => {
      const url = "/library";
      const searchParams = "group=none";
      const { container } = renderWithRouter(
         <GroupBySelect />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GroupBySelect - groupBy date - test", async () => {
      const url = "/library";
      const searchParams = "group=date";
      const { container } = renderWithRouter(
         <GroupBySelect />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GroupBySelect - groupBy model - test", async () => {
      const url = "/library";
      const searchParams = "group=model";
      const { container } = renderWithRouter(
         <GroupBySelect />,
         url,
         searchParams
      );

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
      const searchParams = "group=none";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<GroupBySelect />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const select = screen.getByTestId("group-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const categoryOption = screen.getByTestId("category");
         assertInDocument(categoryOption);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const categoryOption = screen.getByTestId("category");
      userEvent.click(categoryOption);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?group=category",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("GroupBySelect - option model selected - test", async () => {
      const url = "/library";
      const searchParams = "group=none";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<GroupBySelect />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const select = screen.getByTestId("group-by-select");
      userEvent.click(select);

      await waitFor(() => {
         const modelOption = screen.getByTestId("model");
         assertInDocument(modelOption);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const modelOption = screen.getByTestId("model");
      userEvent.click(modelOption);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?group=model",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
