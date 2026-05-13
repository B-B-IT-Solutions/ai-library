import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   DPrompt0FollowUpUpdate,
   DPrompt0Update,
} from "@/data/types/domain/prompt";

import { PromptFollowUpEdit } from "./prompt-follow-up-edit";

type Props = {
   index?: number;
   followUpUpdate: DPrompt0FollowUpUpdate;
   removeFollowUpPrompt: jest.Mock;
};
const TestWrapper = ({
   index = 0,
   followUpUpdate,
   removeFollowUpPrompt,
}: Props) => {
   const methods = useForm<DPrompt0Update>({
      defaultValues: {
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: [followUpUpdate],
      },
   });

   return (
      <FormProvider {...methods}>
         <PromptFollowUpEdit
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

describe("PromptFollowUpEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptFollowUpEdit rendered test", async () => {
      const udpate = dtestData.dPromptFollowUpUpdate();
      const removeFn = jest.fn();

      const { container } = render(
         <TestWrapper removeFollowUpPrompt={removeFn} followUpUpdate={udpate} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFollowUpEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptFollowUpEdit - remove btn clicked - index 1 - test", async () => {
      const udpate = dtestData.dPromptFollowUpUpdate();
      const removeFn = jest.fn();
      const index = 1;

      render(
         <TestWrapper
            index={index}
            removeFollowUpPrompt={removeFn}
            followUpUpdate={udpate}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(removeFn).not.toHaveBeenCalled();
      });

      const removeBtn = screen.getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      expect(removeFn).toHaveBeenCalledTimes(1);
      expect(removeFn).toHaveBeenCalledWith(index);
   });

   it("PromptFollowUpEdit - remove btn clicked - index 5 - test", async () => {
      const udpate = dtestData.dPromptFollowUpUpdate();
      const removeFn = jest.fn();
      const index = 5;

      render(
         <TestWrapper
            index={index}
            removeFollowUpPrompt={removeFn}
            followUpUpdate={udpate}
         />
      );

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
