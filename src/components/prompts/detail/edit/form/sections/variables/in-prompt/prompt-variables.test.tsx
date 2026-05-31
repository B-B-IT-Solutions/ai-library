import { triggerDragEnd } from "@dnd-kit/core";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { map } from "es-toolkit/compat";
import { FormProvider, useForm } from "react-hook-form";

import { existingTemplateFieldInitValues } from "@/components/shared/template-fields";
import { CallbackFn } from "@/data/types/common";
import { DPromptUpdate, DPromptVariable } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";

import { PromptVariables } from "./prompt-variables";

type Props = {
   fields: DPromptVariable[];
   globalFields: DGlobalPromptField[];
   globalFieldIds: string[];
   detectedVariables: string[];
   onAddField: CallbackFn;
   onRemoveField: (index: number) => void;
   onMoveField?: (from: number, to: number) => void;
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
   onMoveField = jest.fn(),
   onAddGlobalFieldIds,
   onRemoveGlobalFieldId,
}: Props) => {
   const form = useForm<DPromptUpdate>({
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
         <PromptVariables
            fields={fields}
            globalFields={globalFields}
            globalFieldIds={globalFieldIds}
            detectedVariables={detectedVariables}
            onAddField={onAddField}
            onRemoveField={onRemoveField}
            onMoveField={onMoveField}
            onAddGlobalFieldIds={onAddGlobalFieldIds}
            onRemoveGlobalFieldId={onRemoveGlobalFieldId}
            control={form.control}
            watch={form.watch}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const variables = screen.getByTestId("prompt-variables");
   const addBtn = screen.getByTestId("add-btn");

   assertInDocument(variables);
   assertInDocument(addBtn);
};

const assertTemplateFieldsRendered = () => {
   const fields = screen.getByTestId("fields");
   const variables = screen.getAllByTestId("prompt-variable");

   assertInDocument(fields);
   expect(variables).toHaveLength(3);
};

const assertTemplateFieldsEmpty = () => {
   const empty = screen.getByTestId("fields-empty");
   const variables = screen.queryAllByTestId("prompt-variable");

   assertInDocument(empty);
   expect(variables).toHaveLength(0);
};

const assertGlobalFieldsRendered = () => {
   const globalFields = screen.getByTestId("prompt-global-variables");
   const fieldItems = screen.getAllByTestId("prompt-global-variable");

   assertInDocument(globalFields);
   expect(fieldItems).toHaveLength(1);
};

const assertGlobalFieldsNotRendered = () => {
   const globalFields = screen.queryByTestId("prompt-global-variables");
   assertNotInDocument(globalFields);
};

describe("PromptVariables rendering tests", () => {
   it("variables empty - test", () => {
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

   it("variables - test", () => {
      const variables = dtestData.dPromptVariables();
      variables[0].name = " ";
      const globalFields = dtestData.dGlobalPromptFields();
      const globalFieldIds = dtestData.dGlobalPromptFieldIds();

      const { container } = render(
         <TestWrapper
            fields={variables}
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

describe("PromptVariables functionality tests", () => {
   it("add global variable btn clicked - test", async () => {
      const variables = dtestData.dPromptVariables();
      const globalFields = dtestData.dGlobalPromptFields();
      const addGlobalFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={variables}
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

   it("remove global variable btn clicked - test", async () => {
      const variables = dtestData.dPromptVariables();
      const globalFields = dtestData.dGlobalPromptFields();
      const globalField = globalFields[0];
      const globalFieldIds = [globalField.id];
      const removeGlobalFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={variables}
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

   it("add prompt variable btn clicked - test", async () => {
      const variables = dtestData.dPromptVariables();
      const detectedVariables = [variables[0].name];
      const addFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={variables}
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

   it("remove prompt variable btn clicked - test", async () => {
      const variables = dtestData.dPromptVariables();
      const detectedVariables = [variables[0].name];
      const removeFieldFn = jest.fn();

      render(
         <TestWrapper
            fields={variables}
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

describe("PromptVariables handleDragEnd tests", () => {
   const renderWithFields = (
      fields: DPromptVariable[],
      onMoveField: jest.Mock
   ) => {
      render(
         <TestWrapper
            fields={fields}
            globalFields={[]}
            globalFieldIds={[]}
            detectedVariables={[]}
            onAddField={jest.fn()}
            onRemoveField={jest.fn()}
            onMoveField={onMoveField}
            onAddGlobalFieldIds={jest.fn()}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );
   };

   it("drags from index 0 to index 1 - test", async () => {
      const onMoveField = jest.fn();
      const fields = dtestData.dPromptVariables();
      renderWithFields(fields, onMoveField);

      await waitFor(() =>
         expect(screen.getByTestId("fields")).toBeInTheDocument()
      );

      triggerDragEnd({
         active: { id: fields[0].id },
         over: { id: fields[1].id },
      });

      expect(onMoveField).toHaveBeenCalledTimes(1);
      expect(onMoveField).toHaveBeenCalledWith(0, 1);
   });

   it("drags from last to first index - test", async () => {
      const onMoveField = jest.fn();
      const fields = dtestData.dPromptVariables();
      renderWithFields(fields, onMoveField);

      await waitFor(() =>
         expect(screen.getByTestId("fields")).toBeInTheDocument()
      );

      triggerDragEnd({
         active: { id: fields[2].id },
         over: { id: fields[0].id },
      });

      expect(onMoveField).toHaveBeenCalledTimes(1);
      expect(onMoveField).toHaveBeenCalledWith(2, 0);
   });

   it("active and over are same id - does not call onMoveField - test", async () => {
      const onMoveField = jest.fn();
      const fields = dtestData.dPromptVariables();
      renderWithFields(fields, onMoveField);

      await waitFor(() =>
         expect(screen.getByTestId("fields")).toBeInTheDocument()
      );

      triggerDragEnd({
         active: { id: fields[0].id },
         over: { id: fields[0].id },
      });

      expect(onMoveField).not.toHaveBeenCalled();
   });

   it("over is null - does not call onMoveField - test", async () => {
      const onMoveField = jest.fn();
      const fields = dtestData.dPromptVariables();
      renderWithFields(fields, onMoveField);

      await waitFor(() =>
         expect(screen.getByTestId("fields")).toBeInTheDocument()
      );

      triggerDragEnd({ active: { id: fields[0].id }, over: null });

      expect(onMoveField).not.toHaveBeenCalled();
   });

   it("active.id not found in fields - does not call onMoveField - test", async () => {
      const onMoveField = jest.fn();
      const fields = dtestData.dPromptVariables();
      renderWithFields(fields, onMoveField);

      await waitFor(() =>
         expect(screen.getByTestId("fields")).toBeInTheDocument()
      );

      triggerDragEnd({
         active: { id: "unknown-id" },
         over: { id: fields[1].id },
      });

      expect(onMoveField).not.toHaveBeenCalled();
   });

   it("over.id not found in fields - does not call onMoveField - test", async () => {
      const onMoveField = jest.fn();
      const fields = dtestData.dPromptVariables();
      renderWithFields(fields, onMoveField);

      await waitFor(() =>
         expect(screen.getByTestId("fields")).toBeInTheDocument()
      );

      triggerDragEnd({
         active: { id: fields[0].id },
         over: { id: "unknown-id" },
      });

      expect(onMoveField).not.toHaveBeenCalled();
   });
});
