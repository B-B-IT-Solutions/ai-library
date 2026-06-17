import { useInfiniteQuery } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
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

type FormValues = { promptId: string | undefined };

type WrapperProps = {
   value?: string;
   required?: boolean;
};

const TestWrapper = ({ value, required }: WrapperProps) => {
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
   const field = screen.getByTestId("promptId");
   const trigger = screen.getByTestId("item-select");

   assertInDocument(field);
   assertInDocument(trigger);
};

const assertPopoverContentRendered = () => {
   const searchInput = screen.getByTestId("search-input");
   const item1 = screen.getByText("Prompt Alpha");
   const item2 = screen.getByText("Prompt Beta");

   assertInDocument(searchInput);
   assertInDocument(item1);
   assertInDocument(item2);
};

const assertPopoverContentNotRendered = () => {
   const searchInput = screen.queryByTestId("search-input");
   assertNotInDocument(searchInput);
};

describe("FormSelectLoadableValues rendering tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
   });

   it("value undefined - test", async () => {
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("value defined - test", async () => {
      const { container } = render(
         <TestWrapper value="test 1" required={true} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("FormSelectLoadableValues functionality tests", () => {
   beforeEach(() => {
      mockUseInfiniteQuery.mockReturnValue(makeQueryResult());
      mockQueryOptions.mockClear();
   });

   it("trigger clicked btn - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertPopoverContentNotRendered();
      });

      const trigger1 = screen.getByTestId("item-select");
      await userEvent.click(trigger1);

      await waitFor(() => {
         assertPopoverContentRendered();
      });

      const item1 = screen.getByText("Prompt Alpha");
      await userEvent.click(item1);

      await waitFor(() => {
         assertPopoverContentNotRendered();
      });

      const trigger2 = screen.getByTestId("item-select");
      const selectedItem = within(trigger2).getByText("Prompt Alpha");
      assertInDocument(selectedItem);

      expect(mockQueryOptions).toHaveBeenCalled();
      expect(mockQueryOptions).toHaveBeenCalledWith("");
   });

   it("items search - test", async () => {
      render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         assertPopoverContentNotRendered();
      });

      const trigger1 = screen.getByTestId("item-select");
      await userEvent.click(trigger1);

      await waitFor(() => {
         assertPopoverContentRendered();
      });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "A");

      const item1 = screen.getByText("Prompt Alpha");
      await userEvent.click(item1);

      await waitFor(() => {
         assertPopoverContentNotRendered();
      });

      const trigger2 = screen.getByTestId("item-select");
      const selectedItem = within(trigger2).getByText("Prompt Alpha");
      assertInDocument(selectedItem);

      expect(mockQueryOptions).toHaveBeenCalled();
      expect(mockQueryOptions).toHaveBeenCalledWith("A");
   });
});

describe("SelectCommandEmpty rendering tests", () => {
   const assertLoadingRendered = () => {
      const empty = screen.getByTestId("command-empty-loading");
      assertInDocument(empty);
   };

   const assertEmptyRendered = () => {
      const empty = screen.getByTestId("command-empty");
      assertInDocument(empty);
   };

   it("isLoading true - test", () => {
      const { container } = render(
         <Command>
            <CommandList>
               <SelectCommandEmpty isLoading={true} />
            </CommandList>
         </Command>
      );

      assertLoadingRendered();
      expect(container).toMatchSnapshot();
   });

   it("isLoading false - test", () => {
      const { container } = render(
         <Command>
            <CommandList>
               <SelectCommandEmpty isLoading={false} />
            </CommandList>
         </Command>
      );

      assertEmptyRendered();
      expect(container).toMatchSnapshot();
   });
});

describe("SelectCommandItem rendering tests", () => {
   const item = {
      id: "1",
      title: "Test Prompt",
   };

   const assertRendered = () => {
      const item = screen.getByTestId("command-item");
      assertInDocument(item);
   };

   it("selected true - test", () => {
      const { container } = render(
         <Command>
            <CommandList>
               <CommandGroup>
                  <SelectCommandItem
                     item={item}
                     isSelected={true}
                     onSelect={jest.fn()}
                  />
               </CommandGroup>
            </CommandList>
         </Command>
      );

      assertRendered();

      expect(container).toMatchSnapshot();
   });

   it("selected false - test", () => {
      const { container } = render(
         <Command>
            <CommandList>
               <CommandGroup>
                  <SelectCommandItem
                     item={item}
                     isSelected={false}
                     onSelect={jest.fn()}
                  />
               </CommandGroup>
            </CommandList>
         </Command>
      );

      assertRendered();

      expect(container).toMatchSnapshot();
   });

   it("onSelect clicked - test", async () => {
      const onSelect = jest.fn();

      render(
         <Command>
            <CommandList>
               <CommandGroup>
                  <SelectCommandItem
                     item={item}
                     isSelected={false}
                     onSelect={onSelect}
                  />
               </CommandGroup>
            </CommandList>
         </Command>
      );

      const commandItem = screen.getByTestId("command-item");
      await userEvent.click(commandItem);

      expect(onSelect).toHaveBeenCalled();
   });
});
