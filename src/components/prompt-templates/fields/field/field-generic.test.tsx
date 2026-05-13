import { FC } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptField } from "@/data/types/domain/prompt.template";

import { GenericField } from "./field-generic";

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
         <GenericField field={field} control={methods.control} />
      </FormProvider>
   );
};

const baseField: DPromptField = {
   id: "test-generic",
   promptTemplateId: "1",
   name: "name-1",
   description: "This is a test description",
   label: "Test Input",
   type: "TEXT",
   required: false,
   order: 1,
   defaultValue: null,
};

const assertRendered = () => {
   const field = screen.getByTestId("name-1");
   const label = screen.getByText("Test Input");

   assertInDocument(field);
   assertInDocument(label);
};

const assertType = (type: string) => {
   const input = screen.getByTestId("input");
   assertHasAttributeWithValue(input, "type", type);
};

describe("GenericField rendering tests", () => {
   it("GenericField - type TEXT - test", async () => {
      const field: DPromptField = {
         ...baseField,
         type: "TEXT",
      };
      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered();
         assertType("text");
      });

      expect(container).toMatchSnapshot();
   });

   it("GenericField - type TEXT - test", async () => {
      const field: DPromptField = {
         ...baseField,
         type: "NUMBER",
      };
      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered();
         assertType("number");
      });

      expect(container).toMatchSnapshot();
   });

   it("GenericField - - type EMAIL - test", async () => {
      const field: DPromptField = {
         ...baseField,
         type: "EMAIL",
         required: true,
      };

      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered();
         assertType("email");
      });

      expect(container).toMatchSnapshot();
   });

   it("GenericField - - type DATE - test", async () => {
      const field: DPromptField = {
         ...baseField,
         type: "DATE",
         required: true,
      };

      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered();
         assertType("date");
      });

      expect(container).toMatchSnapshot();
   });
});
