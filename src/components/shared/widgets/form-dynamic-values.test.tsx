import { FC } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormDynamicValues } from "./form-dynamic-values";

type Props = {
   name: string;
   label: string;
   placeholder: string;
   initialValues?: string[];
};

const TestWrapper: FC<Props> = ({
   name,
   label,
   placeholder,
   initialValues,
}) => {
   const form = useForm({
      defaultValues: {
         [name]: initialValues,
      },
   });

   return (
      <FormProvider {...form}>
         <FormDynamicValues
            name={name}
            label={label}
            placeholder={placeholder}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   const input = screen.getByTestId("input");
   const addBtn = screen.getByTestId("add-value-btn");

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
   it("FormDynamicValues - init values undefined - test", () => {
      const name = "categories";
      const { container } = render(
         <TestWrapper
            name={name}
            label="Categories"
            placeholder="Add category"
            initialValues={undefined}
         />
      );

      assertRendered(name);
      assertValuesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("FormDynamicValues - init values empty - test", () => {
      const name = "categories";
      const { container } = render(
         <TestWrapper
            name={name}
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
      const initialValues = ["JavaScript", "TypeScript", "React"];

      const { container } = render(
         <TestWrapper
            name={name}
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
            label="Categories"
            placeholder="Add category"
         />
      );

      const input = screen.getByTestId("input") as HTMLInputElement;
      const addBtn = screen.getByTestId("add-value-btn");

      const value = "JavaScript";
      await userEvent.type(input, value);
      await userEvent.click(addBtn);

      await waitFor(() => {
         expect(input.value).toBe("");
      });

      assertValueRendered(value);
   });

   it("FormDynamicValues - add value - enter pressed - test", async () => {
      render(
         <TestWrapper
            name="categories"
            label="Categories"
            placeholder="Add category"
         />
      );

      const input = screen.getByTestId("input") as HTMLInputElement;

      const value = "TypeScript";
      await userEvent.type(input, "TypeScript{Enter}");

      await waitFor(() => {
         expect(input.value).toBe("");
      });

      assertValueRendered(value);
   });

   it("FormDynamicValues - remove value - remove btn clicked - test", async () => {
      render(
         <TestWrapper
            name="categories"
            label="Categories"
            placeholder="Add category"
            initialValues={["JavaScript", "TypeScript"]}
         />
      );

      const value = "JavaScript";
      assertValueRendered(value);

      const removeBtns = screen.getAllByTestId("remove-value-btn");

      await userEvent.click(removeBtns[0]);

      assertValueNotRendered(value);
   });

   it("FormDynamicValues - add value - duplicates not allowed - test", async () => {
      render(
         <TestWrapper
            name="categories"
            label="Categories"
            placeholder="Add category"
            initialValues={["JavaScript"]}
         />
      );

      await waitFor(() => {
         const matches = screen.getAllByText("JavaScript");
         expect(matches).toHaveLength(1);
      });

      const input = screen.getByTestId("input");
      const addBtn = screen.getByTestId("add-value-btn");

      await userEvent.type(input, "JavaScript");
      await userEvent.click(addBtn);

      await waitFor(() => {
         const matches = screen.getAllByText("JavaScript");
         expect(matches).toHaveLength(1);
      });
   });

   it("FormDynamicValues - add value - empty value not allowed - test", async () => {
      render(
         <TestWrapper
            name="categories"
            label="Categories"
            placeholder="Add category"
         />
      );

      assertValuesNotRendered();

      const input = screen.getByTestId("input");
      const addBtn = screen.getByTestId("add-value-btn");

      await userEvent.type(input, "   ");
      await userEvent.click(addBtn);

      assertValuesNotRendered();
   });
});
