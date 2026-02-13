import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput } from "./form-input";

type Props = {
   field: string;
   label: string;
   placeholder: string;
};

const TestWrapper: FC<Props> = ({ field, label, placeholder }) => {
   const methods = useForm({
      defaultValues: {
         [field]: "",
      },
   });

   return (
      <FormProvider {...methods}>
         <FormInput
            field={field}
            label={label}
            placeholder={placeholder}
            control={methods.control}
         />
      </FormProvider>
   );
};

const assertRendered = (fieldName: string) => {
   const field = screen.getByTestId(fieldName);
   assertInDocument(field);
};

describe("FormInput rendering tests", () => {
   it("FormInput rendered test", () => {
      const field = "test-1";
      const { container } = render(
         <TestWrapper
            field={field}
            label="Label 1"
            placeholder="Placeholder 1"
         />
      );

      assertRendered(field);

      expect(container).toMatchSnapshot();
   });
});
