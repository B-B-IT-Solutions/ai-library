import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput } from "./form-input";

type Props = {
   name: string;
   label: string;
   placeholder: string;
};

const TestWrapper: FC<Props> = ({ name, label, placeholder }) => {
   const methods = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...methods}>
         <FormInput
            name={name}
            label={label}
            placeholder={placeholder}
            control={methods.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("FormInput rendering tests", () => {
   it("FormInput rendered test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper name={name} label="Label 1" placeholder="Placeholder 1" />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
