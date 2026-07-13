import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormComboboxLoadableValues } from "./form-combobox-loadable-values";

jest.mock("@tanstack/react-query", () => ({
   ...jest.requireActual("@tanstack/react-query"),
   useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockQueryOptions = jest.fn().mockReturnValue({});

const makeQueryResult = (overrides: Record<string, unknown> = {}) => ({
   data: ["Marketing", "Support"],
   isLoading: false,
   ...overrides,
});

type Props = {
   name: string;
   label: string;
   placeholder: string;
   initialValues?: string[];
   maxItems?: number;
};

const TestWrapper: FC<Props> = ({
   name,
   label,
   placeholder,
   initialValues,
   maxItems,
}) => {
   const form = useForm({
      defaultValues: {
         [name]: initialValues,
      },
   });

   return (
      <FormProvider {...form}>
         <FormComboboxLoadableValues
            name={name}
            label={label}
            placeholder={placeholder}
            control={form.control}
            maxItems={maxItems}
            queryOptions={mockQueryOptions}
         />
      </FormProvider>
   );
};

const openPopover = async () => {
   const trigger = screen.getByTestId("combobox-trigger");
   await userEvent.click(trigger);

   await waitFor(() => {
      assertInDocument(screen.getByTestId("search-input"));
   });
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   const trigger = screen.getByTestId("combobox-trigger");

   assertInDocument(field);
   assertInDocument(trigger);
};

const assertValueRendered = (value: string) => {
   const el = screen.getByText(value);
   assertInDocument(el);
};

const assertValueNotRendered = (value: string) => {
   const el = screen.queryByText(value);
   assertNotInDocument(el);
};

describe("FormComboboxMultiValues rendering tests", () => {
   beforeEach(() => {
      mockUseQuery.mockReturnValue(makeQueryResult());
   });

   it("init values undefined - test", () => {
      const { container } = render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
         />
      );

      assertRendered("categories");
      assertNotInDocument(screen.queryByTestId("current-values"));

      expect(container).toMatchSnapshot();
   });

   it("init values - test", () => {
      const { container } = render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
            initialValues={["Marketing"]}
         />
      );

      assertRendered("categories");
      assertValueRendered("Marketing");

      expect(container).toMatchSnapshot();
   });
});

describe("FormComboboxMultiValues functionality tests", () => {
   beforeEach(() => {
      mockUseQuery.mockReturnValue(makeQueryResult());
   });

   it("select existing option from list - test", async () => {
      render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
         />
      );

      await openPopover();

      const option = screen.getByText("Marketing");
      await userEvent.click(option);

      await waitFor(() => {
         assertValueRendered("Marketing");
      });
   });

   it("create new category when no match exists - test", async () => {
      mockUseQuery.mockReturnValue(makeQueryResult({ data: ["Marketing"] }));

      render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
         />
      );

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Vertrieb");

      const createOption = screen.getByTestId("create-option-item");
      await userEvent.click(createOption);

      await waitFor(() => {
         assertValueRendered("Vertrieb");
      });
   });

   it("selecting existing option reuses exact stored spelling (case-insensitive dedupe) - test", async () => {
      mockUseQuery.mockReturnValue(makeQueryResult({ data: ["Marketing"] }));

      render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
         />
      );

      await openPopover();

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "marketing");

      assertNotInDocument(screen.queryByTestId("create-option-item"));

      const option = screen.getByTestId("option-item");
      await userEvent.click(option);

      await waitFor(() => {
         const matches = screen.getAllByText("Marketing");
         expect(matches).toHaveLength(1);
      });
   });

   it("remove selected value - test", async () => {
      mockUseQuery.mockReturnValue(makeQueryResult({ data: ["Marketing"] }));

      render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
            initialValues={["Marketing"]}
         />
      );

      assertValueRendered("Marketing");

      const removeBtn = screen.getByTestId("remove-value-btn");
      await userEvent.click(removeBtn);

      assertValueNotRendered("Marketing");
   });

   it("max items reached disables trigger and shows hint - test", () => {
      const allCategories = ["Marketing", "Support", "Sales", "HR", "Coding"];
      mockUseQuery.mockReturnValue(makeQueryResult({ data: allCategories }));

      render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
            initialValues={allCategories}
            maxItems={5}
         />
      );

      const trigger = screen.getByTestId("combobox-trigger");
      const hint = screen.getByTestId("limit-hint");

      expect(trigger).toBeDisabled();
      assertInDocument(hint);
   });

   it("no matching options and no search shows empty state - test", async () => {
      mockUseQuery.mockReturnValue(makeQueryResult({ data: [] }));

      render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
         />
      );

      await openPopover();

      assertInDocument(screen.getByTestId("command-empty"));
   });

   it("loading state shows loading indicator - test", async () => {
      mockUseQuery.mockReturnValue(
         makeQueryResult({ data: [], isLoading: true })
      );

      render(
         <TestWrapper
            name="categories"
            label="Kategorien"
            placeholder="Kategorie hinzufügen"
         />
      );

      await openPopover();

      assertInDocument(screen.getByTestId("command-empty-loading"));
   });
});
