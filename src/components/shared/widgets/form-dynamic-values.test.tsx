import { FC } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormDynamicValues } from "./form-dynamic-values";

type Props = {
   name: string;
   nameInput: string;
   label: string;
   placeholder: string;
   initialValues?: string[];
};

const TestWrapper: FC<Props> = ({
   name,
   nameInput,
   label,
   placeholder,
   initialValues = [],
}) => {
   const form = useForm({
      defaultValues: {
         [name]: initialValues,
         [nameInput]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <FormDynamicValues
            name={name}
            nameInput={nameInput}
            label={label}
            placeholder={placeholder}
            control={form.control}
            watch={form.watch}
            setValue={form.setValue}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   const input = screen.getByTestId("input");
   const addBtn = screen.getByTestId("add-btn");

   assertInDocument(field);
   assertInDocument(input);
   assertInDocument(addBtn);
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
   const el = screen.getByText(value);
   assertInDocument(el);
};

const assertValueNotRendered = (value: string) => {
   const el = screen.queryByText(value);
   assertNotInDocument(el);
};

describe("FormDynamicValues rendering tests", () => {
   it("FormDynamicValues - init values empty - test", () => {
      const name = "categories";
      const nameInput = "categoryInput";
      const { container } = render(
         <TestWrapper
            name={name}
            nameInput={nameInput}
            label="Categories"
            placeholder="Add category"
            initialValues={[]}
         />
      );

      assertRendered(name);
      assertValuesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("FormDynamicValues - init values - test", () => {
      const name = "categories";
      const nameInput = "categoryInput";
      const initialValues = ["JavaScript", "TypeScript", "React"];

      const { container } = render(
         <TestWrapper
            name={name}
            nameInput={nameInput}
            label="Categories"
            placeholder="Add category"
            initialValues={initialValues}
         />
      );

      assertRendered(name);
      assertValuesRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("FormDynamicValues functionality tests", () => {
   it("FormDynamicValues - add value - add btn clicked - test", async () => {
      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
         />
      );

      const input = screen.getByTestId("input");
      const addBtn = screen.getByTestId("add-btn");

      const value = "JavaScript";
      await userEvent.type(input, value);
      await userEvent.click(addBtn);

      assertValueRendered(value);
   });

   it("FormDynamicValues - add value - enter pressed - test", async () => {
      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
         />
      );

      const input = screen.getByTestId("input");

      const value = "TypeScript";
      await userEvent.type(input, "TypeScript{Enter}");

      assertValueRendered(value);
   });

   it("should clear input field after adding a value", async () => {
      const user = userEvent.setup();

      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
         />
      );

      const input = screen.getByPlaceholderText(
         "Add category"
      ) as HTMLInputElement;
      const addButton = screen.getByRole("button", { name: /hinzufügen/i });

      await user.type(input, "React");
      await user.click(addButton);

      await waitFor(() => {
         expect(input.value).toBe("");
      });
   });

   it("should remove a value when clicking the X button", async () => {
      const user = userEvent.setup();

      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
            initialValues={["JavaScript", "TypeScript"]}
         />
      );

      expect(screen.getByText("JavaScript")).toBeInTheDocument();

      const container = screen.getByTestId("categories");
      const removeButtons = container.querySelectorAll("button[type='button']");

      // First remove button (excluding the "Hinzufügen" button which is last)
      await user.click(removeButtons[0]);

      await waitFor(() => {
         expect(screen.queryByText("JavaScript")).not.toBeInTheDocument();
      });

      expect(screen.getByText("TypeScript")).toBeInTheDocument();
   });

   it("should not add duplicate values", async () => {
      const user = userEvent.setup();

      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
            initialValues={["JavaScript"]}
         />
      );

      const input = screen.getByPlaceholderText("Add category");
      const addButton = screen.getByRole("button", { name: /hinzufügen/i });

      await user.type(input, "JavaScript");
      await user.click(addButton);

      await waitFor(() => {
         const matches = screen.getAllByText("JavaScript");
         expect(matches).toHaveLength(1);
      });
   });

   it("should not add empty values", async () => {
      const user = userEvent.setup();

      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
         />
      );

      const input = screen.getByPlaceholderText("Add category");
      const addButton = screen.getByRole("button", { name: /hinzufügen/i });

      await user.type(input, "   ");
      await user.click(addButton);

      const container = screen.getByTestId("categories");
      const tags = container.querySelectorAll(".rounded-full");
      expect(tags).toHaveLength(0);
   });

   it("should not add value when input is empty", async () => {
      const user = userEvent.setup();

      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
         />
      );

      const addButton = screen.getByRole("button", { name: /hinzufügen/i });

      await user.click(addButton);

      const container = screen.getByTestId("categories");
      const tags = container.querySelectorAll(".rounded-full");
      expect(tags).toHaveLength(0);
   });
});
