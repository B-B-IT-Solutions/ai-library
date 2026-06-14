import { useInfiniteQuery } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   Command,
   CommandGroup,
   CommandList,
} from "@/components/shadcn/command";

import {
   FormSelectLoadableValues,
   SelectCommandEmpty,
   SelectCommandItem,
} from "./form-select-loadable-values";

jest.mock("@tanstack/react-query", () => ({
   ...jest.requireActual("@tanstack/react-query"),
   useInfiniteQuery: jest.fn(),
}));

const mockUseInfiniteQuery = useInfiniteQuery as jest.Mock;

const mockItems = [
   { id: "1", title: "Prompt Alpha" },
   { id: "2", title: "Prompt Beta" },
];

const makeQueryResult = (overrides: Record<string, unknown> = {}) => ({
   data: { pages: [{ content: mockItems }] },
   fetchNextPage: jest.fn(),
   hasNextPage: false,
   isFetching: false,
   isLoading: false,
   ...overrides,
});

const mockQueryOptions = jest.fn().mockReturnValue({});

type FormValues = { promptId: string };

type WrapperProps = {
   value?: string;
   required?: boolean;
};

const TestWrapper = ({ value = "", required }: WrapperProps) => {
   const form = useForm<FormValues>({
      defaultValues: { promptId: value },
   });
   return (
      <FormProvider {...form}>
         <FormSelectLoadableValues<FormValues>
            name="promptId"
            label="Prompt"
            placeholder="Prompt suchen…"
            required={required}
            control={form.control}
            queryOptions={mockQueryOptions}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const trigger = screen.getByTestId("item-select");
   assertInDocument(trigger);
};

describe("FormSelectLoadableValues rendering tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
   });

   it("FormSelectLoadableValues - without required - test", () => {
      const { container } = render(<TestWrapper />);

      assertRendered();
      expect(screen.queryByText("*")).not.toBeInTheDocument();

      expect(container).toMatchSnapshot();
   });

   it("FormSelectLoadableValues - with required - test", () => {
      const { container } = render(<TestWrapper required={true} />);

      assertRendered();
      expect(screen.getByText("*")).toBeInTheDocument();

      expect(container).toMatchSnapshot();
   });

   it("FormSelectLoadableValues - with pre-selected value - test", async () => {
      const { container } = render(<TestWrapper value="1" />);

      assertRendered();
      await waitFor(() => {
         expect(
            within(screen.getByTestId("item-select")).getByText("Prompt Alpha")
         ).toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("FormSelectLoadableValues functionality tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
      mockQueryOptions.mockClear();
   });

   it("FormSelectLoadableValues - opens popover on trigger click - test", async () => {
      render(<TestWrapper />);

      expect(
         screen.queryByPlaceholderText("Prompt suchen…")
      ).not.toBeInTheDocument();

      await userEvent.click(screen.getByTestId("item-select"));

      expect(screen.getByPlaceholderText("Prompt suchen…")).toBeInTheDocument();
      expect(screen.getByText("Prompt Alpha")).toBeInTheDocument();
      expect(screen.getByText("Prompt Beta")).toBeInTheDocument();
   });

   it("FormSelectLoadableValues - selects item and closes popover - test", async () => {
      render(<TestWrapper />);
      await userEvent.click(screen.getByTestId("item-select"));
      await userEvent.click(screen.getByText("Prompt Alpha"));

      await waitFor(() => {
         expect(
            screen.queryByPlaceholderText("Prompt suchen…")
         ).not.toBeInTheDocument();
         expect(
            within(screen.getByTestId("item-select")).getByText("Prompt Alpha")
         ).toBeInTheDocument();
      });
   });

   it("FormSelectLoadableValues - calls queryOptions with empty string initially - test", () => {
      render(<TestWrapper />);
      expect(mockQueryOptions).toHaveBeenCalledWith("");
   });

   it("FormSelectLoadableValues - calls queryOptions with search term - test", async () => {
      render(<TestWrapper />);
      await userEvent.click(screen.getByTestId("item-select"));
      await userEvent.type(screen.getByPlaceholderText("Prompt suchen…"), "A");

      await waitFor(() => {
         expect(mockQueryOptions).toHaveBeenCalledWith("A");
      });
   });

   it("FormSelectLoadableValues - shows loading state - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({ isLoading: true, data: undefined })
      );
      render(<TestWrapper />);
      await userEvent.click(screen.getByTestId("item-select"));

      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
   });

   it("FormSelectLoadableValues - shows empty message when no items - test", async () => {
      mockUseInfiniteQuery.mockReturnValue(
         makeQueryResult({ data: { pages: [{ content: [] }] } })
      );
      render(<TestWrapper />);
      await userEvent.click(screen.getByTestId("item-select"));

      expect(screen.getByText("Kein Prompt gefunden.")).toBeInTheDocument();
   });
});

describe("SelectCommandEmpty rendering tests", () => {
   const renderEmpty = (isLoading: boolean) =>
      render(
         <Command>
            <CommandList>
               <SelectCommandEmpty isLoading={isLoading} />
            </CommandList>
         </Command>
      );

   it("SelectCommandEmpty - isLoading true - shows spinner - test", () => {
      const { container } = renderEmpty(true);

      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
      expect(container).toMatchSnapshot();
   });

   it("SelectCommandEmpty - isLoading false - shows empty message - test", () => {
      const { container } = renderEmpty(false);

      expect(screen.getByText("Kein Prompt gefunden.")).toBeInTheDocument();
      expect(container).toMatchSnapshot();
   });
});

describe("SelectCommandItem rendering tests", () => {
   const item = { id: "1", title: "Test Prompt" };
   const onSelect = jest.fn();

   const renderItem = (isSelected: boolean) =>
      render(
         <Command>
            <CommandList>
               <CommandGroup>
                  <SelectCommandItem
                     item={item}
                     isSelected={isSelected}
                     onSelect={onSelect}
                  />
               </CommandGroup>
            </CommandList>
         </Command>
      );

   beforeEach(() => {
      onSelect.mockClear();
   });

   it("SelectCommandItem - not selected - test", () => {
      const { container } = renderItem(false);

      assertInDocument(screen.getByText("Test Prompt"));
      expect(document.querySelector(".opacity-0")).toBeInTheDocument();

      expect(container).toMatchSnapshot();
   });

   it("SelectCommandItem - selected - test", () => {
      const { container } = renderItem(true);

      assertInDocument(screen.getByText("Test Prompt"));
      expect(document.querySelector(".opacity-100")).toBeInTheDocument();

      expect(container).toMatchSnapshot();
   });

   it("SelectCommandItem - calls onSelect on click - test", async () => {
      renderItem(false);
      await userEvent.click(screen.getByText("Test Prompt"));
      expect(onSelect).toHaveBeenCalled();
   });
});
