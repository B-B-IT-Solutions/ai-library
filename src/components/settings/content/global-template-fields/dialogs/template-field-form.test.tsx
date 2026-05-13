import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DGlobalPromptFieldUpdate } from "@/data/types/domain/settings";

import { GlobalPromptFieldForm } from "./template-field-form";

type Props = {
   data: DGlobalPromptFieldUpdate;
};

const TestWrapper: FC<Props> = ({ data }) => {
   const form = useForm({
      defaultValues: data,
   });

   return (
      <FormProvider {...form}>
         <GlobalPromptFieldForm watch={form.watch} control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const form = screen.getByTestId("template-field-form");
   const name = screen.getByTestId("name");
   const label = screen.getByTestId("label");
   const type = screen.getByTestId("type");
   const defaultValue = screen.getByTestId("defaultValue");
   const description = screen.getByTestId("description");
   const required = screen.getByTestId("required");

   assertInDocument(form);
   assertInDocument(name);
   assertInDocument(label);
   assertInDocument(type);
   assertInDocument(defaultValue);
   assertInDocument(description);
   assertInDocument(required);
};

const assertOptionsRendered = () => {
   const options = screen.getByTestId("options");
   assertInDocument(options);
};

const assertOptionsNotRendered = () => {
   const options = screen.queryByTestId("options");
   assertNotInDocument(options);
};

describe("GlobalPromptFieldForm rendering tests", () => {
   it("GlobalPromptFieldForm - type NUMBER - test", () => {
      const data = dtestData.dGlobalPromptFieldUpdate();
      data.type = "NUMBER";
      data.options = undefined;
      const { container } = render(<TestWrapper data={data} />);

      assertRendered();
      assertOptionsNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("GlobalPromptFieldForm - type SELECT - test", () => {
      const data = dtestData.dGlobalPromptFieldUpdate();
      data.type = "SELECT";
      const { container } = render(<TestWrapper data={data} />);

      assertRendered();
      assertOptionsRendered();

      expect(container).toMatchSnapshot();
   });
});
