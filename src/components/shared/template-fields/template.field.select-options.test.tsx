import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";

import { TemplateFieldSelectOptions } from "./template.field.select-options";

type Props = {
   name: string;
   type: DPromptTemplateFieldType;
};

const TestWrapper: FC<Props> = ({ name, type }) => {
   const form = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <TemplateFieldSelectOptions
            name={name}
            type={type}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("TemplateFieldSelectOptions rendering tests", () => {
   it("TemplateFieldSelectOptions - type TEXT - test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} type="TEXT" />);

      expect(container.firstChild).toBeNull();
   });

   it("TemplateFieldSelectOptions - type NUMBER - test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} type="NUMBER" />);

      expect(container.firstChild).toBeNull();
   });

   it("TemplateFieldSelectOptions - type EMAIL - test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} type="EMAIL" />);

      expect(container.firstChild).toBeNull();
   });

   it("TemplateFieldSelectOptions - type SELECT - test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} type="SELECT" />);

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("TemplateFieldSelectOptions - type RADIO - test", () => {
      const name = "test-1";
      const { container } = render(<TestWrapper name={name} type="RADIO" />);

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
