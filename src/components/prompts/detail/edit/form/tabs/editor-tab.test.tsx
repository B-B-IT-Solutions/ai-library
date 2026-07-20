import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DPromptUpdate } from "@/data/types/domain/prompt";

import { PromptEditorTab } from "./editor-tab";

const TestWrapper = () => {
   const form = useForm<DPromptUpdate>({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         model: "Claude",
         categories: [],
         fields: [],
      },
   });

   const tabid = "prompt-editor";
   return (
      <FormProvider {...form}>
         <Tabs defaultValue={tabid}>
            <TabsList>
               <TabsTrigger value={tabid}>Prompt</TabsTrigger>
            </TabsList>
            <PromptEditorTab tabId={tabid} form={form} />
         </Tabs>
      </FormProvider>
   );
};

const assertRendered = () => {
   const tab = screen.getByTestId("prompt-editor-tab");
   const promptText = screen.getByTestId("prompt-text");

   assertInDocument(tab);
   assertInDocument(promptText);
};

describe("PromptEditorTab rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
