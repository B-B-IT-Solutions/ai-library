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
   assertInDocument(field);
};

const assertValuesRendered = () => {
   const values = screen.getByTestId("current-values");
   assertInDocument(values);
};

const assertValuesNotRendered = () => {
   const values = screen.queryByTestId("current-values");
   assertNotInDocument(values);
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
   it("should add a value when clicking the add button", async () => {
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

      await user.type(input, "JavaScript");
      await user.click(addButton);

      await waitFor(() => {
         expect(screen.getByText("JavaScript")).toBeInTheDocument();
      });
   });

   it("should add a value when pressing Enter key", async () => {
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

      await user.type(input, "TypeScript{Enter}");

      await waitFor(() => {
         expect(screen.getByText("TypeScript")).toBeInTheDocument();
      });
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

   it("should trim whitespace from values", async () => {
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

      await user.type(input, "  React  ");
      await user.click(addButton);

      await waitFor(() => {
         expect(screen.getByText("React")).toBeInTheDocument();
         expect(screen.queryByText("  React  ")).not.toBeInTheDocument();
      });
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

   it("should add multiple unique values", async () => {
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

      const values = ["JavaScript", "TypeScript", "React"];

      for (const value of values) {
         await user.type(input, value);
         await user.click(addButton);
      }

      await waitFor(() => {
         values.forEach((value) => {
            expect(screen.getByText(value)).toBeInTheDocument();
         });
      });
   });

   it("should remove all values individually", async () => {
      const user = userEvent.setup();

      const initialValues = ["JavaScript", "TypeScript", "React"];

      render(
         <TestWrapper
            name="categories"
            nameInput="categoryInput"
            label="Categories"
            placeholder="Add category"
            initialValues={initialValues}
         />
      );

      const container = screen.getByTestId("categories");

      // Remove all values one by one
      for (let i = 0; i < initialValues.length; i++) {
         const removeButtons = container.querySelectorAll(
            "button[type='button']"
         );
         // Click first remove button (excluding the "Hinzufügen" button)
         await user.click(removeButtons[0]);
      }

      await waitFor(() => {
         const tags = container.querySelectorAll(".rounded-full");
         expect(tags).toHaveLength(0);
      });
   });

   it("should prevent form submission when pressing Enter in input", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      const FormWithSubmit: FC = () => {
         const form = useForm({
            defaultValues: {
               categories: [],
               categoryInput: "",
            },
         });

         return (
            <FormProvider {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormDynamicValues
                     name="categories"
                     nameInput="categoryInput"
                     label="Categories"
                     placeholder="Add category"
                     control={form.control}
                     watch={form.watch}
                     setValue={form.setValue}
                  />
                  <button type="submit">Submit Form</button>
               </form>
            </FormProvider>
         );
      };

      render(<FormWithSubmit />);

      const input = screen.getByPlaceholderText("Add category");

      await user.type(input, "JavaScript{Enter}");

      await waitFor(() => {
         expect(screen.getByText("JavaScript")).toBeInTheDocument();
      });

      expect(onSubmit).not.toHaveBeenCalled();
   });
});
