import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { TemplateFieldDefaultValue } from "./template.field.default-value";

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
         <TemplateFieldDefaultValue name={name} control={form.control} />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("TemplateFieldDefaultValue rendering tests", () => {
   it("TemplateFieldDefaultValue rendered test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} />);

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
