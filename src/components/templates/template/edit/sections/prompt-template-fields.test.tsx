import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { map } from "es-toolkit/compat";
import { FormProvider, useForm } from "react-hook-form";

import { existingTemplateFieldInitValues } from "@/components/shared/template-fields";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateField,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { PromptTemplateFields } from "./prompt-template-fields";

type Props = {
   fields: DPromptTemplateField[];
   globalFields: DGlobalTemplateField[];
   globalFieldIds: string[];
   detectedVariables: string[];
   onAddField: CallbackFn;
   onRemoveField: (index: number) => void;
   onAddGlobalFieldIds: (ids: string[]) => void;
   onRemoveGlobalFieldId: (id: string) => void;
};

const TestWrapper = ({
   fields,
   globalFields,
   globalFieldIds,
   detectedVariables,
   onAddField,
   onRemoveField,
   onAddGlobalFieldIds,
   onRemoveGlobalFieldId,
}: Props) => {
   const form = useForm<DPromptTemplateUpdate>({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         recommendedModel: "Claude",
         categories: [],
         fields: map(fields, existingTemplateFieldInitValues),
         globalFieldIds: [],
      },
   });

   return (
      <FormProvider {...form}>
         <PromptTemplateFields
            fields={fields}
            globalFields={globalFields}
            globalFieldIds={globalFieldIds}
            detectedVariables={detectedVariables}
            onAddField={onAddField}
            onRemoveField={onRemoveField}
            onAddGlobalFieldIds={onAddGlobalFieldIds}
            onRemoveGlobalFieldId={onRemoveGlobalFieldId}
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

const assertTemplateFieldsRendered = () => {
   const fields = screen.getByTestId("fields");
   const fieldItems = screen.getAllByTestId("prompt-template-field");

   assertInDocument(fields);
   expect(fieldItems).toHaveLength(3);
};

const assertTemplateFieldsEmpty = () => {
   const empty = screen.getByTestId("fields-empty");
   const fieldItems = screen.queryAllByTestId("prompt-template-field");

   assertInDocument(empty);
   expect(fieldItems).toHaveLength(0);
};

const assertGlobalFieldsRendered = () => {
   const globalFields = screen.getByTestId("prompt-global-template-fields");
   const fieldItems = screen.getAllByTestId("prompt-global-template-field");

   assertInDocument(globalFields);
   expect(fieldItems).toHaveLength(1);
};

const assertGlobalFieldsNotRendered = () => {
   const globalFields = screen.queryByTestId("prompt-global-template-fields");
   assertNotInDocument(globalFields);
};

describe("PromptTemplateFieldss rendering tests", () => {
   it("PromptTemplateFields - fields empty - test", () => {
      const { container } = render(
         <TestWrapper
            fields={[]}
            globalFields={[]}
            globalFieldIds={[]}
            detectedVariables={[]}
            onAddField={jest.fn()}
            onRemoveField={jest.fn()}
            onAddGlobalFieldIds={jest.fn()}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );

      assertRendered();
      assertTemplateFieldsEmpty();
      assertGlobalFieldsNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("PromptTemplateFields - fields - test", () => {
      const fields = dtestData.dPromptTemplateFields();
      fields[0].name = " ";
      const globalFields = dtestData.dGlobalTemplateFields();
      const globalFieldIds = dtestData.dGlobalTemplateFieldIds();

      const { container } = render(
         <TestWrapper
            fields={fields}
            globalFields={globalFields}
            globalFieldIds={globalFieldIds}
            detectedVariables={[]}
            onAddField={jest.fn()}
            onRemoveField={jest.fn()}
            onAddGlobalFieldIds={jest.fn()}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );

      assertRendered();
      assertTemplateFieldsRendered();
      assertGlobalFieldsRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("PromptTemplateFields functionality tests", () => {
   it("PromptTemplateFields - add global field btn clicked - test", async () => {
      const fields = dtestData.dPromptTemplateFields();
      const globalFields = dtestData.dGlobalTemplateFields();
      const addGlobalFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={fields}
            globalFields={globalFields}
            globalFieldIds={[]}
            detectedVariables={[]}
            onAddField={jest.fn()}
            onRemoveField={jest.fn()}
            onAddGlobalFieldIds={addGlobalFieldFn}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );

      assertRendered();
      expect(addGlobalFieldFn).not.toHaveBeenCalled();

      const globalFieldBtn = screen.getByTestId(
         "global-template-fields-picker"
      );
      await userEvent.click(globalFieldBtn);

      const fieldOption1 = screen.getAllByTestId("field-option")[0];
      await userEvent.click(fieldOption1);

      const addBtn = screen.getByTestId("add-fields-btn");
      await userEvent.click(addBtn);

      const globalField = globalFields[0];

      expect(addGlobalFieldFn).toHaveBeenCalledTimes(1);
      expect(addGlobalFieldFn).toHaveBeenCalledWith([globalField.id]);
   });

   it("PromptTemplateFields - remove global field btn clicked - test", async () => {
      const fields = dtestData.dPromptTemplateFields();
      const globalFields = dtestData.dGlobalTemplateFields();
      const globalField = globalFields[0];
      const globalFieldIds = [globalField.id];
      const removeGlobalFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={fields}
            globalFields={globalFields}
            globalFieldIds={globalFieldIds}
            detectedVariables={[]}
            onAddField={jest.fn()}
            onRemoveField={jest.fn()}
            onAddGlobalFieldIds={jest.fn()}
            onRemoveGlobalFieldId={removeGlobalFieldFn}
         />
      );

      assertRendered();
      expect(removeGlobalFieldFn).not.toHaveBeenCalled();

      const removeGlobalFieldBtn = screen.getByTestId(
         "remove-global-field-btn"
      );
      await userEvent.click(removeGlobalFieldBtn);

      expect(removeGlobalFieldFn).toHaveBeenCalledTimes(1);
      expect(removeGlobalFieldFn).toHaveBeenCalledWith(globalField.id);
   });

   it("PromptTemplateFields - add prompt template field btn clicked - test", async () => {
      const fields = dtestData.dPromptTemplateFields();
      const detectedVariables = [fields[0].name];
      const addFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={fields}
            globalFields={[]}
            globalFieldIds={[]}
            detectedVariables={detectedVariables}
            onAddField={addFieldFn}
            onRemoveField={jest.fn()}
            onAddGlobalFieldIds={jest.fn()}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );

      assertRendered();
      expect(addFieldFn).not.toHaveBeenCalled();

      const addBtn = screen.getByTestId("add-btn");
      await userEvent.click(addBtn);
      expect(addFieldFn).toHaveBeenCalledTimes(1);
   });

   it("PromptTemplateFields - remove prompt template field btn clicked - test", async () => {
      const fields = dtestData.dPromptTemplateFields();
      const detectedVariables = [fields[0].name];
      const removeFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={fields}
            globalFields={[]}
            globalFieldIds={[]}
            detectedVariables={detectedVariables}
            onAddField={jest.fn()}
            onRemoveField={removeFieldFn}
            onAddGlobalFieldIds={jest.fn()}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );

      assertRendered();
      expect(removeFieldFn).not.toHaveBeenCalled();

      const removeBtn = screen.getAllByTestId("remove-btn")[0];
      await userEvent.click(removeBtn);
      expect(removeFieldFn).toHaveBeenCalledTimes(1);
   });
});
