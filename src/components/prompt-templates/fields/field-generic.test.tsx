import { FC } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptTemplateField } from "@/data/types/domain/prompt.template";

import { GenericField } from "./field-generic";

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
         <GenericField field={field} control={methods.control} />
      </FormProvider>
   );
};

const baseField: DPromptTemplateField = {
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

const assertRendered = (required = false) => {
   const field = screen.getByTestId("name-1-field");
   const label = screen.getByText(`Test Input${required ? " *" : ""}`);

   assertInDocument(field);
   assertInDocument(label);
};

const assertType = (type: string) => {
   const input = screen.getByTestId("field-input");
   assertHasAttributeWithValue(input, "type", type);
};

describe("GenericField rendering tests", () => {
   it("GenericField - type TEXT - test", async () => {
      const field: DPromptTemplateField = {
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
      const field: DPromptTemplateField = {
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
      const field: DPromptTemplateField = {
         ...baseField,
         type: "EMAIL",
         required: true,
      };

      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered(true);
         assertType("email");
      });

      expect(container).toMatchSnapshot();
   });

   it("GenericField - - type DATE - test", async () => {
      const field: DPromptTemplateField = {
         ...baseField,
         type: "DATE",
         required: true,
      };

      const { container } = render(<TestWrapper field={field} />);

      await waitFor(() => {
         assertRendered(true);
         assertType("date");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("GenericField functionality tests", () => {
   it("GenericField - text input - test", async () => {
      render(<TestWrapper field={baseField} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;

      assertInDocument(input);
      expect(input.value).toBe("");

      await userEvent.type(input, "Hello World");

      await waitFor(() => {
         expect(input.value).toBe("Hello World");
      });
   });

   it("GenericField - number input - test", async () => {
      const numberField: DPromptTemplateField = {
         ...baseField,
         type: "NUMBER",
      };

      render(<TestWrapper field={numberField} />);

      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      assertInDocument(input);
      expect(input.value).toBe("");

      await userEvent.type(input, "123");

      await waitFor(() => {
         expect(input.value).toBe("123");
      });
   });
});
