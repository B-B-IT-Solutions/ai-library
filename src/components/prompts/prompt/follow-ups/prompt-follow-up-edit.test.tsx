import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { FollowUpPromptEdit } from "./prompt-follow-up-edit";
import { PromptFormValues } from "./prompt-follow-ups-edit";

const TestWrapper = ({
   index = 0,
   defaultValue = "",
   removeFollowUpPrompt,
}: {
   index?: number;
   defaultValue?: string;
   removeFollowUpPrompt: jest.Mock;
}) => {
   const methods = useForm<PromptFormValues>({
      defaultValues: {
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: [defaultValue],
      },
   });

   return (
      <FormProvider {...methods}>
         <FollowUpPromptEdit
            index={index}
            control={methods.control}
            removeFollowUpPrompt={removeFollowUpPrompt}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const component = screen.getByTestId("follow-up-prompt-edit");
   const removeBtn = screen.getByTestId("remove-btn");

   assertInDocument(component);
   assertInDocument(removeBtn);
};

describe("FollowUpPromptEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("FollowUpPromptEdit rendered test", async () => {
      const removeFn = jest.fn();
      const { container } = render(
         <TestWrapper
            removeFollowUpPrompt={removeFn}
            defaultValue="follow-up prompt 123"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("FollowUpPromptEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("FollowUpPromptEdit - remove btn clicked - index 1 - test", async () => {
      const removeFn = jest.fn();
      const index = 1;
      render(<TestWrapper index={index} removeFollowUpPrompt={removeFn} />);

      await waitFor(() => {
         assertRendered();
         expect(removeFn).not.toHaveBeenCalled();
      });

      const removeBtn = screen.getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      expect(removeFn).toHaveBeenCalledTimes(1);
      expect(removeFn).toHaveBeenCalledWith(index);
   });

   it("FollowUpPromptEdit - remove btn clicked - index 5 - test", async () => {
      const removeFn = jest.fn();
      const index = 5;
      render(<TestWrapper index={index} removeFollowUpPrompt={removeFn} />);

      await waitFor(() => {
         assertRendered();
         expect(removeFn).not.toHaveBeenCalled();
      });

      const removeBtn = screen.getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      expect(removeFn).toHaveBeenCalledTimes(1);
      expect(removeFn).toHaveBeenCalledWith(index);
   });
});
