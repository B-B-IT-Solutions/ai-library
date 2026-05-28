import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { CallbackFn } from "@/data/types/common";
import { DPromptUpdate } from "@/data/types/domain/prompt";

import { PromptVariable } from "./prompt-variable";

type Props = {
   index: number;
   isUsed: boolean;
   hasName: boolean;
   onRemove: CallbackFn;
};

const TestWrapper = ({ index, isUsed, hasName, onRemove }: Props) => {
   const variables = dtestData.dPromptVariableUpdates(index + 1);
   const form = useForm<DPromptUpdate>({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         recommendedModel: "Claude",
         categories: [],
         fields: variables,
      },
   });

   return (
      <FormProvider {...form}>
         <PromptVariable
            index={index}
            isUsed={isUsed}
            hasName={hasName}
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
      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={false}
            hasName={false}
            onRemove={jest.fn()}
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

   it("hasName true - isUsed false - test", async () => {
      const index = 1;
      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={false}
            hasName={true}
            onRemove={jest.fn()}
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
      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={true}
            hasName={true}
            onRemove={jest.fn()}
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
      render(
         <TestWrapper
            index={index}
            isUsed={false}
            hasName={false}
            onRemove={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertCollapsed();
      });

      const expandBtn = screen.getByTestId("expand-btn");
      userEvent.click(expandBtn);

      await waitFor(() => {
         assertExpanded();
         assertVariablesRendered(index);
      });

      const collapseBtn = screen.getByTestId("collapse-btn");
      userEvent.click(collapseBtn);

      await waitFor(() => {
         assertCollapsed();
      });
   });

   it("remove btn clicked - test", async () => {
      const removeFn = jest.fn();

      render(
         <TestWrapper
            index={0}
            isUsed={false}
            hasName={false}
            onRemove={removeFn}
         />
      );

      assertRendered();
      expect(removeFn).not.toHaveBeenCalled();

      const removeBtn = screen.getByTestId("remove-btn");
      await userEvent.click(removeBtn);
      expect(removeFn).toHaveBeenCalledTimes(1);
   });
});
