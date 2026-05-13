import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { GlobalPromptFieldOption } from "./global-template-field-option";

const assertRendered = async () => {
   const option = screen.getByTestId("field-option");
   assertInDocument(option);
};

describe("GlobalPromptFieldOption rendering tests", () => {
   it("GlobalPromptFieldOption - alreadyAdded true - isSelected true - test", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = render(
         <GlobalPromptFieldOption
            field={field}
            onToggle={jest.fn()}
            alreadyAdded={true}
            isSelected={true}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalPromptFieldOption - alreadyAdded false - isSelected true - test", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = render(
         <GlobalPromptFieldOption
            field={field}
            onToggle={jest.fn()}
            alreadyAdded={false}
            isSelected={true}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalPromptFieldOption - alreadyAdded true - isSelected false - test", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = render(
         <GlobalPromptFieldOption
            field={field}
            onToggle={jest.fn()}
            alreadyAdded={true}
            isSelected={false}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalPromptFieldOption - alreadyAdded false - isSelected false - test", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = render(
         <GlobalPromptFieldOption
            field={field}
            onToggle={jest.fn()}
            alreadyAdded={false}
            isSelected={false}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("GlobalPromptFieldOption functionality tests", () => {
   it("GlobalPromptFieldOption - field selected - isSelected - false - test", async () => {
      const field = dtestData.dGlobalPromptField();
      const onToggleFn = jest.fn();

      render(
         <GlobalPromptFieldOption
            field={field}
            onToggle={onToggleFn}
            alreadyAdded={false}
            isSelected={false}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(onToggleFn).not.toHaveBeenCalled();
      });

      const option = screen.getByTestId("field-option");
      await userEvent.click(option);

      await waitFor(() => {
         expect(onToggleFn).toHaveBeenCalledTimes(1);
         expect(onToggleFn).toHaveBeenCalledWith(field.id);
      });
   });

   it("GlobalPromptFieldOption - field selected - isSelected - true - test", async () => {
      const field = dtestData.dGlobalPromptField();
      const onToggleFn = jest.fn();

      render(
         <GlobalPromptFieldOption
            field={field}
            onToggle={onToggleFn}
            alreadyAdded={false}
            isSelected={true}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(onToggleFn).not.toHaveBeenCalled();
      });

      const option = screen.getByTestId("field-option");
      await userEvent.click(option);

      await waitFor(() => {
         expect(onToggleFn).toHaveBeenCalledTimes(1);
         expect(onToggleFn).toHaveBeenCalledWith(field.id);
      });
   });
});
