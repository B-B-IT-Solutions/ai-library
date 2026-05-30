jest.mock("sonner");

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { DPromptUpdate, DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { initPromptTemplate } from "../utils";

import { PromptVariablesTab } from "./variables-tab";

jest.setTimeout(10000);

type TestWrapperProps = {
   prompt?: DPromptWithContent;
   globalFields: DGlobalPromptField[];
};

const TestWrapper = ({ prompt, globalFields }: TestWrapperProps) => {
   const form = useForm<DPromptUpdate>({
      defaultValues: initPromptTemplate(prompt),
   });

   const tabid = "prompt-editor";
   return (
      <FormProvider {...form}>
         <Tabs defaultValue={tabid}>
            <TabsList>
               <TabsTrigger value={tabid}>Prompt</TabsTrigger>
            </TabsList>
            <PromptVariablesTab
               tabId={tabid}
               form={form}
               globalFields={globalFields}
            />
         </Tabs>
      </FormProvider>
   );
};

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const tab = screen.getByTestId("prompt-variables-tab");

   assertInDocument(tab);
};

const assertPromptVariablesRendered = () => {
   const variables = screen.getByTestId("prompt-variables");
   assertInDocument(variables);
};

const assertPromptVariablesNotRendered = () => {
   const variables = screen.queryByTestId("prompt-variables");
   assertNotInDocument(variables);
};

const assertDetectedVariablesRendered = () => {
   const variables = screen.getByTestId("detected-variables");
   assertInDocument(variables);
};

const assertDetectedVariablesNotRendered = () => {
   const variables = screen.queryByTestId("detected-variables");
   assertNotInDocument(variables);
};

const assertPromptVariablesEmptyRendered = () => {
   const fieldsEmpty = screen.getByTestId("fields-empty");
   const variable = screen.queryByTestId("prompt-variable");
   assertInDocument(fieldsEmpty);
   assertNotInDocument(variable);
};

const assertTemplateFieldsRendered = (count: number) => {
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

const assertGlobalVariablesRendered = () => {
   const globalFields = screen.getByTestId("prompt-global-variables");
   assertInDocument(globalFields);
};

const assertGlobalVariablesNotRendered = () => {
   const globalFields = screen.queryByTestId("prompt-global-variables");
   assertNotInDocument(globalFields);
};

describe("PromptVariablesTab rendering tests", () => {
   it("new prompt - test", async () => {
      const { container } = render(<TestWrapper globalFields={[]} />);

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing prompt - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      const { container } = render(
         <TestWrapper prompt={prompt} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing entry - variables detected in content - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      prompt.content = "Hello {{{{name}}, your role is {{{{role}}";

      const fields = dtestData.dGlobalPromptFields();

      const { container } = render(
         <TestWrapper prompt={prompt} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesRendered();
         assertPromptVariablesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

// describe("PromptEditForm variables detection tests", () => {
//    beforeEach(() => {
//       jest.clearAllMocks();
//    });

//    it("new entry - variables detected in content - test", async () => {
//       const collection = dtestData.dCollection();

//       render(
//          <PromptEditForm
//             globalFields={[]}
//             collection={collection}
//             onSubmit={jest.fn()}
//          />
//       );

//       await waitFor(() => {
//          assertRendered();
//       });

//       const variablesTab = screen.getByTestId("variables-tab-trigger");
//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertDetectedVariablesNotRendered();
//          assertPromptVariablesRendered();
//       });

//       const editorTab = screen.getByTestId("editor-tab-trigger");
//       await userEvent.click(editorTab);

//       await waitFor(() => {
//          assertRendered();
//       });

//       const content = screen
//          .getByTestId("tiptap-editor")
//          .querySelector("input")!;

//       await userEvent.type(
//          content,
//          "Hello {{{{name}}, your role is {{{{role}}"
//       );

//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertDetectedVariablesRendered();
//          assertPromptVariablesRendered();
//       });
//    });
// });

// describe("PromptEditForm functionality tests", () => {
//    beforeEach(() => {
//       jest.clearAllMocks();
//    });

//    it("expand btn clicked - test", async () => {
//       const fields = dtestData.dGlobalPromptFields();
//       render(<PromptEditForm globalFields={fields} onSubmit={jest.fn()} />);

//       await waitFor(() => {
//          assertRendered();
//       });

//       const expandBtn = screen.getByTestId("expand-editor-btn");
//       await userEvent.click(expandBtn);

//       await waitFor(() => {
//          assertEditorExpanded();
//       });

//       await userEvent.click(expandBtn);

//       await waitFor(() => {
//          assertRendered();
//       });
//    });

//    it("add global field btn clicked - test", async () => {
//       const fields = dtestData.dGlobalPromptFields();
//       render(<PromptEditForm globalFields={fields} onSubmit={jest.fn()} />);

//       await waitFor(() => {
//          assertRendered();
//          assertDetectedVariablesNotRendered();
//          assertPromptVariablesNotRendered();
//       });

//       const variablesTab = screen.getByTestId("variables-tab-trigger");
//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertPromptVariablesRendered();
//       });

//       const globalFieldBtn = screen.getByTestId(
//          "global-template-fields-picker"
//       );
//       await userEvent.click(globalFieldBtn);

//       const fieldOption1 = screen.getAllByTestId("field-option")[0];
//       await userEvent.click(fieldOption1);

//       assertGlobalVariablesNotRendered();

//       const addBtn = screen.getByTestId("add-fields-btn");
//       await userEvent.click(addBtn);

//       assertGlobalVariablesRendered();
//       expect(toastMock.success).toHaveBeenCalledTimes(1);
//       expect(toastMock.success).toHaveBeenCalledWith(
//          "1 globale Feld(er) hinzugefügt"
//       );
//    });

//    it("remove global field btn clicked - test", async () => {
//       const prompt = dtestData.dPromptWithContent();
//       const fields = dtestData.dGlobalPromptFields();

//       render(
//          <PromptEditForm
//             prompt={prompt}
//             globalFields={fields}
//             onSubmit={jest.fn()}
//          />
//       );

//       await waitFor(() => {
//          assertRendered();
//          assertDetectedVariablesNotRendered();
//          assertPromptVariablesNotRendered();
//       });

//       const variablesTab = screen.getByTestId("variables-tab-trigger");
//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertPromptVariablesRendered();
//          assertGlobalVariablesRendered();
//       });

//       const removeGlobalFieldBtn = screen.getByTestId(
//          "remove-global-field-btn"
//       );
//       await userEvent.click(removeGlobalFieldBtn);

//       await waitFor(() => {
//          assertGlobalVariablesNotRendered();
//       });
//    });

//    it("add new template field btn clicked - test", async () => {
//       const fields = dtestData.dGlobalPromptFields();
//       render(<PromptEditForm globalFields={fields} onSubmit={jest.fn()} />);

//       await waitFor(() => {
//          assertRendered();
//          assertDetectedVariablesNotRendered();
//          assertPromptVariablesNotRendered();
//       });

//       const variablesTab = screen.getByTestId("variables-tab-trigger");
//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertPromptVariablesRendered();
//          assertPromptVariablesEmptyRendered();
//       });

//       const variablesSection = screen.getByTestId("prompt-variables");
//       const addFieldBtn = within(variablesSection).getByTestId("add-btn");

//       await userEvent.click(addFieldBtn);

//       await waitFor(() => {
//          assertPromptVariableRendered();
//       });
//    });

//    it("remove template field btn clicked - test", async () => {
//       const fields = dtestData.dGlobalPromptFields();
//       render(<PromptEditForm globalFields={fields} onSubmit={jest.fn()} />);

//       await waitFor(() => {
//          assertRendered();
//          assertDetectedVariablesNotRendered();
//          assertPromptVariablesNotRendered();
//       });

//       const variablesTab = screen.getByTestId("variables-tab-trigger");
//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertPromptVariablesRendered();
//          assertPromptVariablesEmptyRendered();
//       });

//       const variablesSection = screen.getByTestId("prompt-variables");
//       const addFieldBtn = within(variablesSection).getByTestId("add-btn");
//       await userEvent.click(addFieldBtn);

//       assertPromptVariableRendered();

//       const variable = screen.getByTestId("prompt-variable");
//       const removeBtn = within(variable).getByTestId("remove-btn");
//       await userEvent.click(removeBtn);

//       await waitFor(() => {
//          assertPromptVariablesEmptyRendered();
//       });
//    });

//    it("add variable as field - test", async () => {
//       const fields = dtestData.dGlobalPromptFields();
//       render(<PromptEditForm globalFields={fields} onSubmit={jest.fn()} />);

//       await waitFor(() => {
//          assertRendered();
//       });

//       const content = screen
//          .getByTestId("tiptap-editor")
//          .querySelector("input")!;

//       await userEvent.type(content, "Hello {{{{name}}");

//       const variablesTab = screen.getByTestId("variables-tab-trigger");
//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertDetectedVariablesRendered();
//          assertPromptVariablesRendered();
//          assertPromptVariablesEmptyRendered();
//       });

//       const detectedVariablesSection = screen.getByTestId("detected-variables");
//       const addVariableBtn = within(detectedVariablesSection).getByTestId(
//          "add-btn"
//       );

//       await userEvent.click(addVariableBtn);

//       await waitFor(() => {
//          assertPromptVariableRendered();
//          expect(toastMock.success).toHaveBeenCalledTimes(1);
//          expect(toastMock.success).toHaveBeenCalledWith(
//             'Feld "name" hinzugefügt'
//          );
//       });
//    });

//    it("sync all variables - test", async () => {
//       const fields = dtestData.dGlobalPromptFields();
//       render(<PromptEditForm globalFields={fields} onSubmit={jest.fn()} />);

//       await waitFor(() => {
//          assertRendered();
//       });

//       const content = screen
//          .getByTestId("tiptap-editor")
//          .querySelector("input")!;

//       await userEvent.type(
//          content,
//          "Hello {{{{name}}, your role is {{{{role}} and title is  {{{{title}}"
//       );

//       const variablesTab = screen.getByTestId("variables-tab-trigger");
//       await userEvent.click(variablesTab);

//       await waitFor(() => {
//          assertDetectedVariablesRendered();
//          assertPromptVariablesRendered();
//          assertPromptVariablesEmptyRendered();
//       });

//       const detectedVariablesSection = screen.getByTestId("detected-variables");
//       const syncAllBtn = within(detectedVariablesSection).getByTestId(
//          "sync-all-btn"
//       );

//       await userEvent.click(syncAllBtn);

//       await waitFor(() => {
//          assertTemplateFieldsRendered(3);
//          expect(toastMock.success).toHaveBeenCalledTimes(4);
//       });
//    });
// });
