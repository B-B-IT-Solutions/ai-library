import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { SortBySelect } from "./sort-by-select";

const assertRendered = () =>
   assertInDocument(screen.getByTestId("sort-by-select"));

describe("SortBySelect rendering tests", () => {
   it("sortBy desc(createdAt) - test", async () => {
      const { container } = renderWithRouter(
         <SortBySelect />,
         "/workflows",
         "sort=desc(createdAt)"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("sortBy asc(createdAt) - test", async () => {
      const { container } = renderWithRouter(
         <SortBySelect />,
         "/workflows",
         "sort=asc(createdAt)"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("sortBy asc(title) - test", async () => {
      const { container } = renderWithRouter(
         <SortBySelect />,
         "/workflows",
         "sort=asc(title)"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("sortBy desc(title) - test", async () => {
      const { container } = renderWithRouter(
         <SortBySelect />,
         "/workflows",
         "sort=desc(title)"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SortBySelect functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("option asc(createdAt) selected - test", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <SortBySelect />,
         "/workflows",
         "sort=desc(createdAt)",
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("sort-by-select"));

      await waitFor(() => assertInDocument(screen.getByTestId("asc-date")));

      await userEvent.click(screen.getByTestId("asc-date"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual("?sort=asc(createdAt)");
      expect(event.options).toEqual({
         history: "replace",
         scroll: false,
         shallow: false,
      });
   });

   it("option asc(title) selected - test", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <SortBySelect />,
         "/workflows",
         "sort=desc(createdAt)",
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("sort-by-select"));

      await waitFor(() => assertInDocument(screen.getByTestId("asc-title")));

      await userEvent.click(screen.getByTestId("asc-title"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual("");
   });

   it("option desc(title) selected - test", async () => {
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <SortBySelect />,
         "/workflows",
         "sort=asc(title)",
         onUrlUpdateFn
      );

      await waitFor(() => assertRendered());

      await userEvent.click(screen.getByTestId("sort-by-select"));

      await waitFor(() => assertInDocument(screen.getByTestId("desc-title")));

      await userEvent.click(screen.getByTestId("desc-title"));

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual("?sort=desc(title)");
   });
});
