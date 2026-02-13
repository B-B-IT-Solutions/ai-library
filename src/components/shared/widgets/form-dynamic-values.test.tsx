import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormDynamicValues } from "./form-dynamic-values";

type Props = {
   name: string;
   nameInput: string;
   label: string;
   placeholder: string;
};

const TestWrapper: FC<Props> = ({ name, nameInput, label, placeholder }) => {
   const form = useForm({
      defaultValues: {
         [name]: undefined,
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

describe("FormDynamicValues rendering tests", () => {
   it("FormDynamicValues rendered test", () => {
      const name = "categories";
      const nameInput = "categoryInput";
      const { container } = render(
         <TestWrapper
            name={name}
            nameInput={nameInput}
            label="Label 1"
            placeholder="Placeholder 1"
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
