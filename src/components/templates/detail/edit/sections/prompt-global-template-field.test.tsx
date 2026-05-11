import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { PromptGlobalTemplateField } from "./prompt-global-template-field";

const assertRendered = () => {
   const field = screen.getByTestId("prompt-global-template-field");
   const removeBtn = screen.getByTestId("remove-global-field-btn");

   assertInDocument(field);
   assertInDocument(removeBtn);
};

describe("PromptGlobalTemplateField rendering tests", () => {
   it("PromptGlobalTemplateField - isUsed false - tests", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = render(
         <PromptGlobalTemplateField
            field={field}
            isUsed={false}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptGlobalTemplateField - isUsed true - tests", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = render(
         <PromptGlobalTemplateField
            field={field}
            isUsed={true}
            onRemoveGlobalFieldId={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptGlobalTemplateField functionality tests", () => {
   it("PromptGlobalTemplateField - remove btn clicked - tests", async () => {
      const field = dtestData.dGlobalTemplateField();
      const removeFn = jest.fn();

      render(
         <PromptGlobalTemplateField
            field={field}
            isUsed={false}
            onRemoveGlobalFieldId={removeFn}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(removeFn).not.toHaveBeenCalled();
      });

      const removeBtn = screen.getByTestId("remove-global-field-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         expect(removeFn).toHaveBeenCalledTimes(1);
         expect(removeFn).toHaveBeenCalledWith(field.id);
      });
   });
});
