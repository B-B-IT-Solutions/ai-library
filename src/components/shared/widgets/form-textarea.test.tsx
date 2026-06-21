import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormTextArea } from "./form-textarea";

type Props = {
   name: string;
   label: string;
   placeholder?: string;
   description?: string | null;
   required?: boolean;
   rows?: number;
   maxLength?: number;
   className?: string;
};

const TestWrapper: FC<Props> = ({
   name,
   label,
   placeholder,
   description,
   required,
   rows,
   maxLength,
   className,
}) => {
   const form = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <FormTextArea
            name={name}
            label={label}
            placeholder={placeholder}
            description={description}
            required={required}
            rows={rows}
            maxLength={maxLength}
            className={className}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("FormTextArea rendering tests", () => {
   it("rows undefined - test", () => {
      const name = "test-123";
      const { container } = render(
         <TestWrapper
            name={name}
            label="Label 1"
            placeholder="Placeholder 1"
            description="Description 1"
            required={true}
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("rows defined - test", () => {
      const name = "test-789";
      const { container } = render(
         <TestWrapper
            name={name}
            label="Label 1"
            placeholder="Placeholder 1"
            rows={5}
            maxLength={750}
            className="mt-1"
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
