import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormSelect, Option } from "./form-select";

type Props = {
   name: string;
   label: string;
   placeholder?: string;
   description?: string;
   required?: boolean;
   options: Option[];
};

const TestWrapper: FC<Props> = ({
   name,
   label,
   placeholder,
   description,
   required,
   options,
}) => {
   const form = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <FormSelect
            name={name}
            label={label}
            placeholder={placeholder}
            description={description}
            required={required}
            options={options}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("FormSelect rendering tests", () => {
   it("FormSelect - options strings - test", () => {
      const name = "test-1";
      const options = ["option 1", "option 2", "option 3"];

      const { container } = render(
         <TestWrapper
            name={name}
            label="Label 1"
            placeholder="Placeholder 1"
            description="Description 1"
            required={true}
            options={options}
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("FormSelect - options objects - test", () => {
      const name = "test-1";
      const options = [
         { value: "option 1", label: "Label 1" },
         { value: "option 2", label: "Label 2" },
         { value: "option 3", label: "Label 2" },
      ];

      const { container } = render(
         <TestWrapper
            name={name}
            label="Label 1"
            placeholder="Placeholder 1"
            options={options}
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
