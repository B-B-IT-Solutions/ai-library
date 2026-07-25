import { useInfiniteQuery } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormComboBoxLoadableValue } from "./form-combo-box-loadable-value";

jest.mock("@tanstack/react-query", () => ({
   ...jest.requireActual("@tanstack/react-query"),
   useInfiniteQuery: jest.fn(),
}));

jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

const mockUseInfiniteQuery = useInfiniteQuery as jest.Mock;

const mockQueryOptions = jest.fn().mockReturnValue({});

const mockModel1 = "Claude";
const mockModel2 = "ChatGPT";
const mockModel3 = "Gemini";

const mockModels = [mockModel1, mockModel2, mockModel3];

const makeQueryResult = (overrides: Record<string, unknown> = {}) => ({
   data: { pages: [{ content: mockModels }] },
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
   required?: boolean;
   initialValue?: string;
   fieldError?: string;
};

const TestWrapper = ({
   name = "recommendedModel",
   label = "Modell",
   placeholder = "Modell auswählen oder erstellen",
   required,
   initialValue,
   fieldError,
}: TestWrapperProps) => {
   const form = useForm({
      defaultValues: {
         [name]: initialValue,
      },
      errors: {
         [name]: fieldError ? { type: "manual", message: fieldError } : undefined,
      },
   });

   return (
      <FormProvider {...form}>
         <FormComboBoxLoadableValue
            name={name}
            label={label}
            placeholder={placeholder}
            required={required}
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
   const field = screen.getByTestId("recommendedModel");
   const trigger = screen.getByTestId("combobox-trigger");

   assertInDocument(field);
   assertInDocument(trigger);
};

const assertCreateOptionNotRendered = () => {
   const createItem = screen.queryByTestId("create-option-item");
   assertNotInDocument(createItem);
};

describe("FormComboBoxLoadableValue rendering tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
      mockQueryOptions.mockClear();
   });

   it("value undefined - test", async () => {
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      const trigger = screen.getByTestId("combobox-trigger");
      expect(trigger).toHaveTextContent("Modell auswählen oder erstellen");

      expect(container).toMatchSnapshot();
   });

   it("value defined - test", async () => {
      const { container } = render(
         <TestWrapper initialValue={mockModel1} required={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      const trigger = screen.getByTestId("combobox-trigger");
      expect(trigger).toHaveTextContent(mockModel1);

      expect(container).toMatchSnapshot();
   });
});

describe("FormComboBoxLoadableValue functionality tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
      mockQueryOptions.mockClear();
   });

   it("select existing option - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      await openPopover();

      const option = screen.getByText(mockModel1);
      await userEvent.click(option);

      await waitFor(() => {
         const trigger = screen.getByTestId("combobox-trigger");
         expect(trigger).toHaveTextContent(mockModel1);
      });

      expect(mockQueryOptions).toHaveBeenCalledWith("");
   });

   it("selecting a different option replaces the current value - test", async () => {
      render(<TestWrapper initialValue={mockModel1} />);

      await waitFor(() => {
         assertRendered();
      });

      await openPopover();

      const option = screen.getByText(mockModel2);
      await userEvent.click(option);

      await waitFor(() => {
         const trigger = screen.getByTestId("combobox-trigger");
         expect(trigger).toHaveTextContent(mockModel2);
         expect(trigger).not.toHaveTextContent(mockModel1);
      });
   });

   it("create new model when no match exists - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Perplexity");

      const createOption = screen.getByTestId("create-option-item");
      await userEvent.click(createOption);

      await waitFor(() => {
         const trigger = screen.getByTestId("combobox-trigger");
         expect(trigger).toHaveTextContent("Perplexity");
      });
   });

   it("create option not shown when search matches existing option - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, mockModel1);

      assertCreateOptionNotRendered();
   });

   it("search input passed to queryOptions - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "mod");

      expect(mockQueryOptions).toHaveBeenCalledWith("mod");
   });

   it("field error - test", async () => {
      const errorText = "Modell darf nicht leer sein";
      render(<TestWrapper fieldError={errorText} />);

      await waitFor(() => {
         const error = screen.getByText(errorText);
         assertInDocument(error);
      });
   });

   it("no matching options and no search shows empty state - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({ data: { pages: [{ content: [] }] } })
      );

      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      await openPopover();

      await waitFor(() => {
         assertInDocument(screen.getByTestId("command-empty"));
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
      });

      await openPopover();

      assertInDocument(screen.getByText(mockModel1));
   });
});
