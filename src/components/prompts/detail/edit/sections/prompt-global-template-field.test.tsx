import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { PromptGlobalPromptField } from "./prompt-global-template-field";

const assertRendered = () => {
   const field = screen.getByTestId("prompt-global-template-field");
   const removeBtn = screen.getByTestId("remove-global-field-btn");

   assertInDocument(field);
   assertInDocument(removeBtn);
};

describe("PromptGlobalPromptField rendering tests", () => {
   it("PromptGlobalPromptField - isUsed false - tests", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = render(
         <PromptGlobalPromptField
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

   it("PromptGlobalPromptField - isUsed true - tests", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = render(
         <PromptGlobalPromptField
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

describe("PromptGlobalPromptField functionality tests", () => {
   it("PromptGlobalPromptField - remove btn clicked - tests", async () => {
      const field = dtestData.dGlobalPromptField();
      const removeFn = jest.fn();

      render(
         <PromptGlobalPromptField
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
