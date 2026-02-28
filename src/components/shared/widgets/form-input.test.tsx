import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput } from "./form-input";

type Props = {
   name: string;
   label: string;
   placeholder?: string;
   description?: string | null;
   required?: boolean;
   message?: string;
   className?: string;
   fixStyling?: boolean;
};

const TestWrapper: FC<Props> = ({
   name,
   label,
   placeholder,
   description,
   required,
   message,
   className,
   fixStyling,
}) => {
   const form = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <FormInput
            name={name}
            label={label}
            placeholder={placeholder}
            description={description}
            required={required}
            message={message}
            className={className}
            fixStyling={fixStyling}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("FormInput rendering tests", () => {
   it("FormInput - message undefined - fixStlying true - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper
            name={name}
            label="Label 1"
            placeholder="Placeholder 1"
            description="Description 1"
            required={true}
            message={undefined}
            className="pb-7"
            fixStyling={true}
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("FormInput - message undefined - fixStlying false - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper
            name={name}
            label="Label 1"
            placeholder="Placeholder 1"
            description="Description 1"
            required={true}
            message={undefined}
            fixStyling={false}
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("FormInput - message defined -  test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper
            name={name}
            label="Label 1"
            placeholder="Placeholder 1"
            message="Test 1"
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
