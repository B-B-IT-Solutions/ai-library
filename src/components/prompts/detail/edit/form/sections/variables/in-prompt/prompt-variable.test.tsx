import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, typeIntoInput } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { CallbackFn } from "@/data/types/common";
import {
   DPromptUpdate,
   DPromptVariableUpdate,
} from "@/data/types/domain/prompt";
import { updateTemplateSchema } from "@/data/types/validators/template";

import { PromptVariable } from "./prompt-variable";

jest.setTimeout(7000);

type Props = {
   index: number;
   isUsed: boolean;
   onRemove: CallbackFn;
   variables: DPromptVariableUpdate[];
};

const TestWrapper = ({ index, isUsed, onRemove, variables }: Props) => {
   const form = useForm<DPromptUpdate>({
      resolver: zodResolver(updateTemplateSchema),
      mode: "onBlur",
      defaultValues: {
         title: "",
         description: "",
         content: "",
         recommendedModel: "Claude",
         categories: [],
         globalFieldIds: [],
         fields: variables,
      },
   });

   return (
      <FormProvider {...form}>
         <PromptVariable
            index={index}
            isUsed={isUsed}
            onRemove={onRemove}
            control={form.control}
            watch={form.watch}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const variable = screen.getByTestId("prompt-variable");
   assertInDocument(variable);
};

const assertCollapsed = () => {
   const expanded = screen.getByTestId("variable-collapsed");
   const expandBtn = screen.getByTestId("expand-btn");
   const removeBtn = screen.getByTestId("remove-btn");

   assertInDocument(expanded);
   assertInDocument(expandBtn);
   assertInDocument(removeBtn);
};

const assertExpanded = () => {
   const expanded = screen.getByTestId("variable-expanded");
   const header = screen.getByTestId("header");
   const collapseBtn = screen.getByTestId("collapse-btn");
   const removeBtn = screen.getByTestId("remove-btn");

   assertInDocument(expanded);
   assertInDocument(header);
   assertInDocument(collapseBtn);
   assertInDocument(removeBtn);
};

const assertVariablesRendered = (index: number) => {
   const name = screen.getByTestId(`fields.${index}.name`);
   const label = screen.getByTestId(`fields.${index}.label`);
   const type = screen.getByTestId(`fields.${index}.type`);
   const defaultValue = screen.getByTestId(`fields.${index}.defaultValue`);
   const description = screen.getByTestId(`fields.${index}.description`);
   const required = screen.getByTestId(`fields.${index}.required`);

   assertInDocument(name);
   assertInDocument(label);
   assertInDocument(type);
   assertInDocument(defaultValue);
   assertInDocument(description);
   assertInDocument(required);
};

describe("PromptVariable rendering tests", () => {
   it("hasName false - isUsed false - test", async () => {
      const index = 0;
      const variable = dtestData.dPromptVariableUpdate();
      variable.name = "";
      variable.label = "";
      variable.options = undefined;

      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={false}
            onRemove={jest.fn()}
            variables={[variable]}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertExpanded();
         assertVariablesRendered(index);
      });

      expect(container).toMatchSnapshot();

      const collapse = screen.getByTestId("collapse-btn");
      userEvent.click(collapse);

      await waitFor(() => {
         assertCollapsed();
      });

      expect(container).toMatchSnapshot();
   });

   it("hasName true - isUsed false - test", async () => {
      const index = 1;
      const variables = dtestData.dPromptVariableUpdates(3);
      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={false}
            onRemove={jest.fn()}
            variables={variables}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCollapsed();
      });

      expect(container).toMatchSnapshot();

      const expandBtn = screen.getByTestId("expand-btn");
      userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
         assertVariablesRendered(index);
      });

      expect(container).toMatchSnapshot();
   });

   it("hasName true - isUsed true - test", async () => {
      const index = 5;
      const variables = dtestData.dPromptVariableUpdates(7);

      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={true}
            onRemove={jest.fn()}
            variables={variables}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCollapsed();
      });

      expect(container).toMatchSnapshot();

      const expandBtn = screen.getByTestId("expand-btn");
      userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
         assertVariablesRendered(index);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptVariable functionality tests", () => {
   it("expand/collapse btn clicked - test", async () => {
      const index = 0;
      const variables = dtestData.dPromptVariableUpdates(3);

      render(
         <TestWrapper
            index={index}
            isUsed={false}
            onRemove={jest.fn()}
            variables={variables}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCollapsed();
      });

      const expandBtn = screen.getByTestId("expand-btn");
      await userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
         assertVariablesRendered(index);
      });

      const collapseBtn = screen.getByTestId("collapse-btn");
      await userEvent.click(collapseBtn);

      await waitFor(() => {
         assertCollapsed();
      });
   });

   it("remove btn clicked - test", async () => {
      const removeFn = jest.fn();
      const variables = dtestData.dPromptVariableUpdates(3);

      render(
         <TestWrapper
            index={0}
            isUsed={false}
            onRemove={removeFn}
            variables={variables}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(removeFn).not.toHaveBeenCalled();
      });

      const removeBtn = screen.getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         expect(removeFn).toHaveBeenCalledTimes(1);
      });
   });

   it("name too long error - test", async () => {
      const index = 0;
      const variable = dtestData.dPromptVariableUpdate();

      render(
         <TestWrapper
            index={index}
            isUsed={false}
            onRemove={jest.fn()}
            variables={[variable]}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCollapsed();
      });

      const expandBtn = screen.getByTestId("expand-btn");
      await userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
      });

      await typeIntoInput(`fields.${index}.name`, "n".repeat(75));

      // Blur triggern damit onBlur-Validierung läuft
      await userEvent.tab();

      await waitFor(() => {
         const errorMessage = screen.getByText(
            "Name zu lang (maximal 50 Zeichen)"
         );
         assertInDocument(errorMessage);
      });

      const collapseBtn = screen.getByTestId("collapse-btn");
      await userEvent.click(collapseBtn);

      await waitFor(() => {
         assertCollapsed();
      });
   });
});
