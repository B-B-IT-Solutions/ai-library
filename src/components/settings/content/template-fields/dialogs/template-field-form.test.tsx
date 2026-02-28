import { FC } from "react";
import { render, screen } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DGlobalTemplateFieldUpdate } from "@/data/types/domain/settings";

import { GlobalTemplateFieldForm } from "./template-field-form";

type Props = {
   data: DGlobalTemplateFieldUpdate;
};

const TestWrapper: FC<Props> = ({ data }) => {
   const form = useForm({
      defaultValues: data,
   });

   return (
      <FormProvider {...form}>
         <GlobalTemplateFieldForm watch={form.watch} control={form.control} />
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

describe("GlobalTemplateFieldForm rendering tests", () => {
   it("GlobalTemplateFieldForm rendered test", () => {
      const data = dtestData.dGlobalTemplateFieldUpdate();
      const { container } = render(<TestWrapper data={data} />);

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
