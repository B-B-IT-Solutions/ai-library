import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { TemplateFieldType } from "./template.field.type";

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
         <TemplateFieldType name={name} control={form.control} />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("TemplateFieldType rendering tests", () => {
   it("TemplateFieldType rendered test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} />);

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
