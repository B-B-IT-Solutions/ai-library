import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { TemplateFieldSelectOptions } from "./template.field.select-options";

type Props = {
   name: string;
};

const TestWrapper: FC<Props> = ({ name }) => {
   const form = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <TemplateFieldSelectOptions name={name} control={form.control} />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("TemplateFieldSelectOptions rendering tests", () => {
   it("TemplateFieldSelectOptions rendered test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} />);

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
