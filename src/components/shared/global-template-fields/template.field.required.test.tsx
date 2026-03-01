import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { TemplateFieldRequired } from "./template.field.required";

type Props = {
   name: string;
};

const TestWrapper: FC<Props> = ({ name }) => {
   const form = useForm({
      defaultValues: {
         [name]: false,
      },
   });

   return (
      <FormProvider {...form}>
         <TemplateFieldRequired name={name} control={form.control} />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("TemplateFieldRequired rendering tests", () => {
   it("TemplateFieldRequired rendered test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} />);

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
