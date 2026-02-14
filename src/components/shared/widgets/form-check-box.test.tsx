import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormCheckBox } from "./form-check-box";

type Props = {
   name: string;
   label: string;
   className?: string;
};

const TestWrapper: FC<Props> = ({ name, label, className }) => {
   const form = useForm({
      defaultValues: {
         [name]: false,
      },
   });

   return (
      <FormProvider {...form}>
         <FormCheckBox
            name={name}
            label={label}
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

describe("FormCheckBox rendering tests", () => {
   it("FormCheckBox - className undefined - test", () => {
      const name = "test-123";
      const { container } = render(<TestWrapper name={name} label="Label 1" />);

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("FormCheckBox - className defined - test", () => {
      const name = "test-789";
      const { container } = render(
         <TestWrapper name={name} label="Label 1" className="py-1" />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
