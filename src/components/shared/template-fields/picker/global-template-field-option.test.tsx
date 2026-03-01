import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { GlobalTemplateFieldOption } from "./global-template-field-option";
import { GlobalTemplateFieldsPicker } from "./global-template-fields-picker";

const assertRendered = async () => {
   const option = screen.getByTestId("field-option");
   assertInDocument(option);
};

describe("GlobalTemplateFieldOption rendering tests", () => {
   it("GlobalTemplateFieldOption - alreadyAdded true - isSelected true - test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = render(
         <GlobalTemplateFieldOption
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

   it("GlobalTemplateFieldOption - alreadyAdded false - isSelected true - test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = render(
         <GlobalTemplateFieldOption
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

   it("GlobalTemplateFieldOption - alreadyAdded true - isSelected false - test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = render(
         <GlobalTemplateFieldOption
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

   it("GlobalTemplateFieldOption - alreadyAdded false - isSelected false - test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = render(
         <GlobalTemplateFieldOption
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

describe("GlobalTemplateFieldOption functionality tests", () => {
   it("GlobalTemplateFieldOption - field selected - isSelected - false - test", async () => {
      const field = dtestData.dGlobalTemplateField();
      const onToggleFn = jest.fn();

      render(
         <GlobalTemplateFieldOption
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
         expect(onToggleFn).toHaveBeenCalledWith(field.id, false);
      });
   });

   it("GlobalTemplateFieldOption - field selected - isSelected - true - test", async () => {
      const field = dtestData.dGlobalTemplateField();
      const onToggleFn = jest.fn();

      render(
         <GlobalTemplateFieldOption
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
         expect(onToggleFn).toHaveBeenCalledWith(field.id, false);
      });
   });
});
