import { FC } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptField } from "@/data/types/domain/prompt.template";

import { RadioField } from "./field-radio";

type Props = {
   field: DPromptField;
   defaultValue?: string;
};

const TestWrapper: FC<Props> = ({ field, defaultValue = "" }) => {
   const methods = useForm({
      defaultValues: {
         [field.name]: defaultValue,
      },
   });

   return (
      <FormProvider {...methods}>
         <RadioField field={field} control={methods.control} />
      </FormProvider>
   );
};

const baseField: DPromptField = {
   id: "test-radio",
   promptTemplateId: "1",
   name: "name-1",
   description: "This is a test description",
   label: "Test Radio",
   type: "RADIO",
   required: false,
   order: 1,
   defaultValue: null,
   options: ["Option 1", "Option 2", "Option 3"],
};

const assertRendered = () => {
   const field = screen.getByTestId("name-1");
   const label = screen.getByText("Test Radio");

   assertInDocument(field);
   assertInDocument(label);
};

describe("RadioField rendering tests", () => {
   it("RadioField - required false - test", async () => {
      const { container } = render(<TestWrapper field={baseField} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("RadioField - required true - test", async () => {
      const field: DPromptField = {
         ...baseField,
         required: true,
         options: undefined,
      };

      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
