import { useInfiniteQuery } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import { upperCase } from "es-toolkit/compat";
import { FormProvider, useForm } from "react-hook-form";

import { FormComboBoxLoadableValues } from "./form-combo-box-loadable-values";

jest.mock("@tanstack/react-query", () => ({
   ...jest.requireActual("@tanstack/react-query"),
   useInfiniteQuery: jest.fn(),
}));

const mockUseInfiniteQuery = useInfiniteQuery as jest.Mock;

const mockQueryOptions = jest.fn().mockReturnValue({});

const mockItem1 = "catagory 1";
const mockItem1UpperCase = upperCase(mockItem1);
const mockItem2 = "catagory 2";
const mockItem3 = "catagory 3";
const mockItem4 = "catagory 4";
const mockItem5 = "catagory 5";

const mockItems = [mockItem1UpperCase, mockItem2, mockItem3];

const makeQueryResult = (overrides: Record<string, unknown> = {}) => ({
   data: { pages: [{ content: mockItems }] },
   fetchNextPage: jest.fn(),
   hasNextPage: false,
   isFetching: false,
   isLoading: false,
   ...overrides,
});

type TestWrapperProps = {
   name?: string;
   label?: string;
   placeholder?: string;
   initialValues?: string[];
   fieldError?: string;
};

const TestWrapper = ({
   name = "categories",
   label = "Kategorien",
   placeholder = "Kategorie hinzufügen",
   initialValues,
   fieldError,
}: TestWrapperProps) => {
   const form = useForm({
      defaultValues: {
         [name]: initialValues,
      },
      errors: {
         [name]: fieldError
            ? { type: "manual", message: fieldError }
            : undefined,
      },
   });

   return (
      <FormProvider {...form}>
         <FormComboBoxLoadableValues
            name={name}
            label={label}
            placeholder={placeholder}
            control={form.control}
            queryOptions={mockQueryOptions}
         />
      </FormProvider>
   );
};

const openPopover = async () => {
   const trigger = screen.getByTestId("combobox-trigger");
   await userEvent.click(trigger);

   await waitFor(() => {
      const searchInput = screen.getByTestId("search-input");
      assertInDocument(searchInput);
   });
};

const assertRendered = () => {
   const field = screen.getByTestId("categories");
   const trigger = screen.getByTestId("combobox-trigger");

   assertInDocument(field);
   assertInDocument(trigger);
};

const assertValuesRendered = () => {
   const values = screen.getByTestId("current-values");
   assertInDocument(values);
};

const assertValuesNotRendered = () => {
   const values = screen.queryByTestId("current-values");
   assertNotInDocument(values);
};

const assertValueRendered = (value: string) => {
   const chips = screen.getByTestId("current-values");
   const el = within(chips).getByText(value);
   assertInDocument(el);
};

const assertValueNotRendered = (value: string) => {
   const el = screen.queryByText(value);
   assertNotInDocument(el);
};

const assertCreateOptionNotRendered = () => {
   const createItem = screen.queryByTestId("create-option-item");
   assertNotInDocument(createItem);
};

const assertEmptyStateRendered = () => {
   const empty = screen.getByTestId("command-empty");
   assertInDocument(empty);
};

describe("FormComboBoxLoadableValues rendering tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
      mockQueryOptions.mockClear();
   });

   it("init values undefined - test", async () => {
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("init values - test", async () => {
      const { container } = render(<TestWrapper initialValues={[mockItem1]} />);

      await waitFor(() => {
         assertRendered();
         assertValuesRendered();
         assertValueRendered(mockItem1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("FormComboBoxLoadableValues functionality tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
      mockQueryOptions.mockClear();
   });

   it("select existing option - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      await openPopover();

      const option = screen.getByText(mockItem1UpperCase);
      await userEvent.click(option);

      await waitFor(() => {
         assertValuesRendered();
         assertValueRendered(mockItem1UpperCase);
      });

      expect(mockQueryOptions).toHaveBeenCalledWith("");
   });

   it("clicking a selected option deselects it - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({
            data: { pages: [{ content: [mockItem1UpperCase] }] },
         })
      );

      render(<TestWrapper initialValues={[mockItem1UpperCase]} />);

      await waitFor(() => {
         assertRendered();
         assertValuesRendered();
      });

      await openPopover();

      const option = screen.getByTestId("option-item");
      await userEvent.click(option);

      await waitFor(() => {
         assertValuesNotRendered();
      });
   });

   it("selecting existing option reuses exact stored spelling (case-insensitive dedupe) - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({
            data: { pages: [{ content: [mockItem1UpperCase] }] },
         })
      );

      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, mockItem1);

      assertCreateOptionNotRendered();

      const option = screen.getByTestId("option-item");
      await userEvent.click(option);

      await waitFor(() => {
         const matches = screen.getAllByText(mockItem1UpperCase);
         expect(matches).toHaveLength(2);
      });
   });

   it("create new category when no match exists - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({ data: { pages: [{ content: [mockItem1] }] } })
      );

      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Vertrieb");

      const createOption = screen.getByTestId("create-option-item");
      await userEvent.click(createOption);

      await waitFor(() => {
         assertValuesRendered();
         assertValueRendered("Vertrieb");
      });
   });

   it("search input passed to queryOptions - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "cat");

      expect(mockQueryOptions).toHaveBeenCalledWith("cat");
   });

   it("remove selected value - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({
            data: { pages: [{ content: [mockItem1UpperCase] }] },
         })
      );

      render(<TestWrapper initialValues={[mockItem1UpperCase]} />);

      await waitFor(() => {
         assertRendered();
         assertValuesRendered();
         assertValueRendered(mockItem1UpperCase);
      });

      const removeBtn = screen.getByTestId("remove-value-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         assertValuesNotRendered();
         assertValueNotRendered(mockItem1UpperCase);
      });
   });

   it("many selected values keep the trigger enabled - test", async () => {
      const allCategories = [
         mockItem1,
         mockItem2,
         mockItem3,
         mockItem4,
         mockItem5,
      ];
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({ data: { pages: [{ content: allCategories }] } })
      );

      render(<TestWrapper initialValues={allCategories} />);

      await waitFor(() => {
         assertRendered();
         assertValuesRendered();
      });

      const trigger = screen.getByTestId("combobox-trigger");
      expect(trigger).not.toBeDisabled();
   });

   it("renders schema-driven field error - test", async () => {
      const errorText = "Kategorie zu lang (maximal 50 Zeichen)";
      render(<TestWrapper fieldError={errorText} />);

      await waitFor(() => {
         const error = screen.getByTestId("field-error");
         expect(error).toHaveTextContent(errorText);
      });
   });

   it("no matching options and no search shows empty state - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({ data: { pages: [{ content: [] }] } })
      );

      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      await openPopover();

      await waitFor(() => {
         assertEmptyStateRendered();
      });
   });

   it("loading state shows loading indicator - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({
            data: { pages: [{ content: [] }] },
            isLoading: true,
         })
      );

      render(<TestWrapper />);
      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      await openPopover();

      assertInDocument(screen.getByTestId("command-empty-loading"));
   });

   it("loads next page on scroll via InfiniteScroll - test", async () => {
      const fetchNextPage = jest.fn();
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({ hasNextPage: true, fetchNextPage })
      );

      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertValuesNotRendered();
      });

      await openPopover();

      assertInDocument(screen.getByText(mockItem1UpperCase));
   });
});
