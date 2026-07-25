import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { DPromptUpdate, DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { updateTemplateSchema } from "@/data/types/validators/prompt";
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

   form.trigger();

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
   const promptEditor = screen.getByTestId("prompt-editor-tab");
   const expandBtn = screen.getByTestId("expand-editor-btn");

   assertInDocument(tabs);
   assertInDocument(editorTab);
   assertInDocument(variablesTab);
   assertInDocument(promptEditor);
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

const assertErrorAlertRendered = () => {
   const alert = screen.getByTestId("error-alert");
   assertInDocument(alert);
};

const assertErrorAlertNotRendered = () => {
   const alert = screen.queryByTestId("error-alert");
   assertNotInDocument(alert);
};

const assertPromptVariablesRendered = () => {
   const variables = screen.getByTestId("prompt-variables");
   assertInDocument(variables);
};

const assertDetectedVariablesRendered = () => {
   const variables = screen.getByTestId("detected-variables");
   assertInDocument(variables);
};

const assertPromptVariablesEmptyRendered = () => {
   const fieldsEmpty = screen.getByTestId("fields-empty");
   const variable = screen.queryByTestId("prompt-variable");
   assertInDocument(fieldsEmpty);
   assertNotInDocument(variable);
};

const assertPromptVariableItemsRendered = (count: number) => {
   const variables = screen.getAllByTestId("prompt-variable");
   const fieldsEmpty = screen.queryByTestId("fields-empty");

   expect(variables).toHaveLength(count);
   assertNotInDocument(fieldsEmpty);
};

const assertPromptVariableRendered = () => {
   const variable = screen.getByTestId("prompt-variable");
   const fieldsEmpty = screen.queryByTestId("fields-empty");

   assertInDocument(variable);
   assertNotInDocument(fieldsEmpty);
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
         assertErrorAlertNotRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertVariablesTabRendered();
         assertErrorAlertNotRendered();
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
         assertErrorAlertRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertVariablesTabRendered();
         assertErrorAlertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFormTabs functionality tests", () => {
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

describe("PromptEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("add detected variable as prompt variable - btn clicked - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      prompt.content = "Hello {{{{name}}";
      prompt.fields = [];

      const globalVariables = dtestData.dGlobalPromptFields();

      render(<TestWrapper prompt={prompt} globalFields={globalVariables} />);

      await waitFor(() => {
         assertRendered();
         assertVariablesTabNotRendered();
      });

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertVariablesTabRendered();
      });

      await waitFor(() => {
         assertDetectedVariablesRendered();
         assertPromptVariablesRendered();
         assertPromptVariablesEmptyRendered();
      });

      const detectedVariablesSection = screen.getByTestId("detected-variables");
      const addVariableBtn = within(detectedVariablesSection).getByTestId(
         "add-btn"
      );

      await userEvent.click(addVariableBtn);

      await waitFor(() => {
         assertPromptVariableRendered();
      });
   });

   it("sync all variables - btn clicked - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      prompt.content =
         "Hello {{{{name}}, your role is {{{{role}} and title is  {{{{title}}";
      prompt.fields = [];

      const globalVariables = dtestData.dGlobalPromptFields();

      render(<TestWrapper prompt={prompt} globalFields={globalVariables} />);

      await waitFor(() => {
         assertRendered();
         assertVariablesTabNotRendered();
      });

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertVariablesTabRendered();
      });

      await waitFor(() => {
         assertDetectedVariablesRendered();
         assertPromptVariablesRendered();
         assertPromptVariablesEmptyRendered();
      });

      const detectedVariablesSection = screen.getByTestId("detected-variables");
      const syncAllBtn = within(detectedVariablesSection).getByTestId(
         "sync-all-btn"
      );

      await userEvent.click(syncAllBtn);

      await waitFor(() => {
         assertPromptVariableItemsRendered(3);
      });
   });
});
