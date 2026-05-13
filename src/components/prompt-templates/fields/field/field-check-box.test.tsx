import { FC } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptField } from "@/data/types/domain/prompt";

import { CheckBoxField } from "./field-check-box";

type Props = {
   field: DPromptField;
   defaultValue?: boolean;
};

const TestWrapper: FC<Props> = ({ field, defaultValue = false }) => {
   const methods = useForm({
      defaultValues: {
         [field.name]: defaultValue,
      },
   });

   return (
      <FormProvider {...methods}>
         <CheckBoxField field={field} control={methods.control} />
      </FormProvider>
   );
};

const baseField: DPromptField = {
   id: "test-check-box",
   promptId: "1",
   name: "name-1",
   description: "This is a test description",
   label: "Test Checkbox",
   type: "CHECKBOX",
   required: false,
   order: 1,
   defaultValue: null,
};

const asseertRendered = () => {
   const field = screen.getByTestId("name-1");
   const label = screen.getByText("Test Checkbox");

   assertInDocument(field);
   assertInDocument(label);
};

const asseertDescriptionRendered = () => {
   const description = screen.getByText("This is a test description");
   assertInDocument(description);
};

const asseertDescriptionNotRendered = () => {
   const description = screen.queryByText("This is a test description");
   assertNotInDocument(description);
};

describe("CheckBoxField rendering tests", () => {
   it("CheckBoxField rendered test", async () => {
      const { container } = render(<TestWrapper field={baseField} />);

      await waitFor(() => {
         asseertRendered();
         asseertDescriptionRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CheckBoxField - without description - test", async () => {
      baseField.description = null;
      baseField.required = true;
      const { container } = render(<TestWrapper field={baseField} />);

      await waitFor(() => {
         asseertRendered();
         asseertDescriptionNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
