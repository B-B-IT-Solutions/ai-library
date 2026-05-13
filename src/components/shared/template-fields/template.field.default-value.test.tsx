import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptFieldType } from "@/data/types/domain/prompt";

import { TemplateFieldDefaultValue } from "./template.field.default-value";

type Props = {
   name: string;
   type: DPromptFieldType;
   options: string[];
};

const TestWrapper: FC<Props> = ({ name, type, options }) => {
   const form = useForm({
      defaultValues: {
         [name]: "",
      },
   });

   return (
      <FormProvider {...form}>
         <TemplateFieldDefaultValue
            name={name}
            type={type}
            options={options}
            control={form.control}
         />
      </FormProvider>
   );
};

const assertRendered = (name: string) => {
   const field = screen.getByTestId(name);
   assertInDocument(field);
};

describe("TemplateFieldDefaultValue rendering tests", () => {
   it("TemplateFieldDefaultValue - type TEXT - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper name={name} type="TEXT" options={[]} />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("TemplateFieldDefaultValue - type EMAIL - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper name={name} type="EMAIL" options={[]} />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("TemplateFieldDefaultValue - type NUMBER - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper name={name} type="NUMBER" options={[]} />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("TemplateFieldDefaultValue - type DATE - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper name={name} type="DATE" options={[]} />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("TemplateFieldDefaultValue - type SELECT - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper
            name={name}
            type="SELECT"
            options={["option 1", "option 2", "option 3"]}
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });

   it("TemplateFieldDefaultValue - type RADIO - test", () => {
      const name = "test-1";
      const { container } = render(
         <TestWrapper
            name={name}
            type="RADIO"
            options={["option 1", "option 2", "option 3"]}
         />
      );

      assertRendered(name);

      expect(container).toMatchSnapshot();
   });
});
