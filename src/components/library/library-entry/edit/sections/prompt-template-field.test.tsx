import { FC } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { CallbackFn } from "@/data/types/common";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

import { PromptTemplateField } from "./prompt-template-field";

type Props = {
   index: number;
   isUsed: boolean;
   hasName: boolean;
   onRemove: CallbackFn;
};

const TestWrapper: FC<Props> = ({ index, isUsed, hasName, onRemove }) => {
   const form = useForm<DPromptTemplateUpdate>({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         recommendedModel: "Claude 3.5 Sonnet",
         categories: [],
         categoryInput: "",
         fields: [],
      },
   });

   return (
      <FormProvider {...form}>
         <PromptTemplateField
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
   const field = screen.getByTestId("prompt-template-field");
   const header = screen.getByTestId("header");
   const removeBtn = screen.getByTestId("remove-btn");

   assertInDocument(field);
   assertInDocument(header);
   assertInDocument(removeBtn);
};

const assertFieldsRendered = (index: number) => {
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

describe("PromptTemplateField rendering tests", () => {
   it("PromptTemplateField - hasName false - isUsed false - test", () => {
      const index = 0;
      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={false}
            hasName={false}
            onRemove={jest.fn()}
         />
      );

      assertRendered();
      assertFieldsRendered(index);

      expect(container).toMatchSnapshot();
   });

   it("PromptTemplateField - - hasName true - isUsed false - test", () => {
      const index = 1;
      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={false}
            hasName={true}
            onRemove={jest.fn()}
         />
      );

      assertRendered();
      assertFieldsRendered(index);

      expect(container).toMatchSnapshot();
   });

   it("PromptTemplateField - hasName true - isUsed true - test", () => {
      const index = 5;
      const { container } = render(
         <TestWrapper
            index={index}
            isUsed={true}
            hasName={true}
            onRemove={jest.fn()}
         />
      );

      assertRendered();
      assertFieldsRendered(index);

      expect(container).toMatchSnapshot();
   });
});

describe("PromptTemplateField functionality tests", () => {
   it("PromptTemplateField - remove btn clicked - test", async () => {
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
