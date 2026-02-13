import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FormSelect } from "./form-select";

type Props = {
   name: string;
   label: string;
   options: string[];
};

const TestWrapper: FC<Props> = ({ name, label, options }) => {
   const methods = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...methods}>
         <FormSelect
            name={name}
            label={label}
            options={options}
            control={methods.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("FormSelect rendering tests", () => {
   it("FormSelect rendered test", () => {
      const name = "test-1";
      const options = ["option 1", "option 2", "option 3"];

      const { container } = render(
         <TestWrapper name={name} label="Label 1" options={options} />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
