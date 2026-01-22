import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument } from "@tests";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { PromptFormValues } from "@/data/types/domain/prompt";

import { PromptFollowUpsEdit } from "./prompt-follow-ups-edit";

const TestWrapper = ({
   followUpPrompts = [],
}: {
   followUpPrompts?: string[];
}) => {
   const methods = useForm<PromptFormValues>({
      defaultValues: {
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: followUpPrompts,
      },
   });

   const { fields, append, remove } = useFieldArray({
      control: methods.control,
      name: "followUpPrompts",
   });

   const addFollowUpPrompt = (value: string) => {
      append(value);
   };

   const removeFollowUpPrompt = (index: number) => {
      remove(index);
   };

   return (
      <FormProvider {...methods}>
         <PromptFollowUpsEdit
            control={methods.control}
            followUpPrompts={fields}
            addFollowUpPrompt={addFollowUpPrompt}
            removeFollowUpPrompt={removeFollowUpPrompt}
         />
      </FormProvider>
   );
};

const assertRendered = () => {
   const component = screen.getByTestId("follow-up-prompts-edit");
   const addBtn = screen.getByTestId("add-btn");

   assertInDocument(component);
   assertInDocument(addBtn);
};

const assertFollowUpsRendered = (count: number) => {
   const followUps = screen.getAllByTestId("follow-up-prompt-edit");
   expect(followUps).toHaveLength(count);
};

describe("PromptFollowUpsEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptFollowUpsEdit - empty array - rendered test", async () => {
      const { container } = render(<TestWrapper followUpPrompts={[]} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptFollowUpsEdit - with prompts - rendered test", async () => {
      const prompts = ["Prompt 1", "Prompt 2"];
      const { container } = render(<TestWrapper followUpPrompts={prompts} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(prompts.length);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFollowUpsEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptFollowUpsEdit - add btn clicked - test", async () => {
      const prompts = ["Prompt 1"];
      render(<TestWrapper followUpPrompts={prompts} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(1);
      });

      const addBtn = screen.getByTestId("add-btn");
      await userEvent.click(addBtn);

      await waitFor(() => {
         assertFollowUpsRendered(2);
      });
   });

   it("PromptFollowUpsEdit - remove button removes prompt", async () => {
      const prompts = ["Prompt 1", "Prompt 2"];
      render(<TestWrapper followUpPrompts={prompts} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(2);
      });

      const removeBtn = screen.getAllByTestId("remove-btn")[0];
      await userEvent.click(removeBtn);

      await waitFor(() => {
         assertFollowUpsRendered(1);
      });
   });
});
