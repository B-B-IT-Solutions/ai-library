import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptUpdate, DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { updateTemplateSchema } from "@/data/types/validators/template";
import { initPromptTemplate } from "../utils";

import { PromptFormTabs } from "./tabs";

jest.setTimeout(10000);

type TestWrapperProps = {
   prompt?: DPromptWithContent;
   globalFields?: DGlobalPromptField[];
   isEditorExpanded?: boolean;
   onToggleExpand?: () => void;
};

const TestWrapper = ({
   prompt,
   globalFields = [],
   isEditorExpanded = false,
   onToggleExpand = jest.fn(),
}: TestWrapperProps) => {
   const form = useForm<DPromptUpdate>({
      defaultValues: initPromptTemplate(prompt),
      resolver: zodResolver(updateTemplateSchema),
      mode: "all",
   });

   return (
      <FormProvider {...form}>
         <PromptFormTabs
            form={form}
            globalFields={globalFields}
            isEditorExpanded={isEditorExpanded}
            onToggleExpand={onToggleExpand}
         />
      </FormProvider>
   );
};
const assertRendered = () => {
   const tabs = screen.getByTestId("prompt-form-tabs");
   const editorTab = screen.getByTestId("editor-tab-trigger");
   const variablesTab = screen.getByTestId("variables-tab-trigger");
   const promptText = screen.getByTestId("prompt-editor-tab");
   const expandBtn = screen.getByTestId("expand-editor-btn");

   assertInDocument(tabs);
   assertInDocument(editorTab);
   assertInDocument(variablesTab);
   assertInDocument(promptText);
   assertInDocument(expandBtn);
};

const assertVariablesTabRendered = () => {
   const tab = screen.getByTestId("prompt-variables-tab");
   assertInDocument(tab);
};

const assertVariablesTabNotRendered = () => {
   const tab = screen.queryByTestId("prompt-variables-tab");
   assertNotInDocument(tab);
};

describe("PromptFormTabs rendering tests", () => {
   it("new prompt - test", async () => {
      const { container } = render(
         <TestWrapper globalFields={[]} isEditorExpanded={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertVariablesTabNotRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertVariablesTabRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing prompt - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const globalVariables = dtestData.dGlobalPromptFields();

      const { container } = render(
         <TestWrapper
            prompt={prompt}
            globalFields={globalVariables}
            isEditorExpanded={true}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertVariablesTabNotRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertVariablesTabRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing prompt - tab errors - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const variable1 = prompt.fields[0];
      variable1.name = "n".repeat(57);

      const { container } = render(<TestWrapper prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertVariablesTabNotRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertVariablesTabRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("expand btn clicked - test", async () => {
      const expandFn = jest.fn();

      render(<TestWrapper onToggleExpand={expandFn} />);

      await waitFor(() => {
         assertRendered();
         expect(expandFn).not.toHaveBeenCalled();
      });

      const expandBtn = screen.getByTestId("expand-editor-btn");
      await userEvent.click(expandBtn);

      await waitFor(() => {
         expect(expandFn).toHaveBeenCalledTimes(1);
      });
   });
});
