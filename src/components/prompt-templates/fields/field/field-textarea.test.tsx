import { FC } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptTemplateField } from "@/data/types/domain/prompt.template";

import { TextAreaField } from "./field-textarea";

type Props = {
   field: DPromptTemplateField;
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
         <TextAreaField field={field} control={methods.control} />
      </FormProvider>
   );
};

const baseField: DPromptTemplateField = {
   id: "test-textarea",
   promptTemplateId: "1",
   name: "name-1",
   description: "This is a test description",
   label: "Test TextArea",
   type: "TEXTAREA",
   required: false,
   order: 1,
   defaultValue: null,
};

const assertRendered = () => {
   const field = screen.getByTestId("name-1-field");
   const label = screen.getByText("Test TextArea");

   assertInDocument(field);
   assertInDocument(label);
};

describe("TextAreaField rendering tests", () => {
   it("TextAreaField - required false - test", async () => {
      const { container } = render(<TestWrapper field={baseField} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("TextAreaField - required true - test", async () => {
      const field: DPromptTemplateField = {
         ...baseField,
         required: true,
      };
      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
