import { FC } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { CallbackFn } from "@/data/types/common";
import { DPromptTemplateField } from "@/data/types/domain/prompt.template";

import { PromptTemplateFields } from "./prompt-template-fields";

type Props = {
   fields: DPromptTemplateField[];
   detectedVariables: string[];
   onAddField: CallbackFn;
   onRemoveField: (index: number) => void;
};

const TestWrapper: FC<Props> = ({
   fields,
   detectedVariables,
   onAddField,
   onRemoveField,
}) => {
   const form = useForm({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         detailedDescription: "",
         recommendedModel: "Claude 3.5 Sonnet",
         categories: [],
         categoryInput: "",
         fields: [],
      },
   });

   return (
      <FormProvider {...form}>
         <PromptTemplateFields
            fields={fields}
            detectedVariables={detectedVariables}
            onAddField={onAddField}
            onRemoveField={onRemoveField}
            control={form.control}
            watch={form.watch}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const templateFields = screen.getByTestId("prompt-template-fields");
   const addBtn = screen.getByTestId("add-btn");

   assertInDocument(templateFields);
   assertInDocument(addBtn);
};

const assertFieldsRendered = () => {
   const fields = screen.getByTestId("fields");
   const fieldItems = screen.getAllByTestId("prompt-template-field");

   assertInDocument(fields);
   expect(fieldItems).toHaveLength(3);
};

const assertFieldsEmpty = () => {
   const empty = screen.getByTestId("fields-empty");
   const fieldItems = screen.queryAllByTestId("prompt-template-field");

   assertInDocument(empty);
   expect(fieldItems).toHaveLength(0);
};

describe("PromptTemplateFieldss rendering tests", () => {
   it("PromptTemplateFields - fields empty - test", () => {
      const { container } = render(
         <TestWrapper
            fields={[]}
            detectedVariables={[]}
            onAddField={jest.fn()}
            onRemoveField={jest.fn()}
         />
      );

      assertRendered();
      assertFieldsEmpty();

      expect(container).toMatchSnapshot();
   });

   it("PromptTemplateFields - fields - test", () => {
      const fields = dtestData.dPromptTemplateFields();

      const { container } = render(
         <TestWrapper
            fields={fields}
            detectedVariables={[]}
            onAddField={jest.fn()}
            onRemoveField={jest.fn()}
         />
      );

      assertRendered();
      assertFieldsRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("PromptTemplateFields functionality tests", () => {
   it("PromptTemplateFields - add btn clicked - test", async () => {
      const fields = dtestData.dPromptTemplateFields();
      const detectedVariables = [fields[0].name];
      const addFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={fields}
            detectedVariables={detectedVariables}
            onAddField={addFieldFn}
            onRemoveField={jest.fn()}
         />
      );

      assertRendered();
      expect(addFieldFn).not.toHaveBeenCalled();

      const addBtn = screen.getByTestId("add-btn");
      await userEvent.click(addBtn);
      expect(addFieldFn).toHaveBeenCalledTimes(1);
   });

   it("PromptTemplateFields - remove btn clicked - test", async () => {
      const fields = dtestData.dPromptTemplateFields();
      const detectedVariables = [fields[0].name];
      const removeFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={fields}
            detectedVariables={detectedVariables}
            onAddField={jest.fn()}
            onRemoveField={removeFieldFn}
         />
      );

      assertRendered();
      expect(removeFieldFn).not.toHaveBeenCalled();

      const removeBtn = screen.getAllByTestId("remove-btn")[0];
      await userEvent.click(removeBtn);
      expect(removeFieldFn).toHaveBeenCalledTimes(1);
   });
});
