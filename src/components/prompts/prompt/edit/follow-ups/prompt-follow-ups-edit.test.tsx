import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import {
   DPrompt0FollowUpUpdate,
   DPrompt0Update,
} from "@/data/types/domain/prompt";

import { PromptFollowUpsEdit } from "./prompt-follow-ups-edit";

type Props = {
   followUpUpdates: DPrompt0FollowUpUpdate[];
};

const TestWrapper = ({ followUpUpdates }: Props) => {
   const form = useForm<DPrompt0Update>({
      defaultValues: {
         title: "",
         content: "",
         categories: [],
         recommendedModel: "",
         followUpPrompts: followUpUpdates,
      },
   });

   const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "followUpPrompts",
      keyName: "_key",
   });

   const addFollowUpPrompt = (value: DPrompt0FollowUpUpdate) => {
      append(value);
   };

   const removeFollowUpPrompt = (index: number) => {
      remove(index);
   };

   return (
      <FormProvider {...form}>
         <PromptFollowUpsEdit
            control={form.control}
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
      const { container } = render(<TestWrapper followUpUpdates={[]} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptFollowUpsEdit - with prompts - rendered test", async () => {
      const updates = dtestData.dPromptFollowUpUpdates();
      const { container } = render(<TestWrapper followUpUpdates={updates} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(updates.length);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFollowUpsEdit functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptFollowUpsEdit - add btn clicked - test", async () => {
      const updates = dtestData.dPromptFollowUpUpdates(3);
      render(<TestWrapper followUpUpdates={updates} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(updates.length);
      });

      const addBtn = screen.getByTestId("add-btn");
      await userEvent.click(addBtn);

      await waitFor(() => {
         assertFollowUpsRendered(updates.length + 1);
      });
   });

   it("PromptFollowUpsEdit - remove btn clicked - test", async () => {
      const updates = dtestData.dPromptFollowUpUpdates(5);
      render(<TestWrapper followUpUpdates={updates} />);

      await waitFor(() => {
         assertRendered();
         assertFollowUpsRendered(updates.length);
      });

      const removeBtn = screen.getAllByTestId("remove-btn")[0];
      await userEvent.click(removeBtn);

      await waitFor(() => {
         assertFollowUpsRendered(updates.length - 1);
      });
   });
});
