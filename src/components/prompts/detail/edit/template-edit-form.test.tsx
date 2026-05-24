jest.mock("@/data/actions/prompt");
jest.mock("sonner");

jest.mock("@/components/shared/md", () => {
   const MDEditor = (
      props: DetailedHTMLProps<
         InputHTMLAttributes<HTMLInputElement>,
         HTMLInputElement
      >
   ) => (
      <div data-testid="tiptap-editor">
         <input
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
         />
      </div>
   );
   return { MDEditor };
});

import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { TemplateEditForm } from "./template-edit-form";

jest.setTimeout(10000);

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("template-edit-form");
   const basicInfo = screen.getByTestId("basic-info");
   const tabs = screen.getByTestId("tabs");
   const editorTab = screen.getByTestId("editor-tab-trigger");
   const variablesTab = screen.getByTestId("variables-tab-trigger");
   const templateContent = screen.getByTestId("prompt-template-content");

   assertInDocument(form);
   assertInDocument(basicInfo);
   assertInDocument(tabs);
   assertInDocument(editorTab);
   assertInDocument(variablesTab);
   assertInDocument(templateContent);
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

const assertTemplateFieldsEmptyRendered = () => {
   const fieldsEmpty = screen.getByTestId("fields-empty");
   const variable = screen.queryByTestId("prompt-variable");
   assertInDocument(fieldsEmpty);
   assertNotInDocument(variable);
};

const assertTemplateFieldRendered = () => {
   const variable = screen.getByTestId("prompt-variable");
   const fieldsEmpty = screen.queryByTestId("fields-empty");

   assertInDocument(variable);
   assertNotInDocument(fieldsEmpty);
};

const assertGlobalFieldsRendered = () => {
   const globalFields = screen.getByTestId("prompt-global-template-fields");
   assertInDocument(globalFields);
};

const assertGlobalFieldsNotRendered = () => {
   const globalFields = screen.queryByTestId("prompt-global-template-fields");
   assertNotInDocument(globalFields);
};

describe("TemplateEditForm rendering tests", () => {
   it("new entry - rendered - test", async () => {
      const { container } = render(
         <TemplateEditForm globalFields={[]} onSubmit={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("new entry - variables detected in content - test", async () => {
      const collectionId = "collection-id-123";

      const { container } = render(
         <TemplateEditForm
            globalFields={[]}
            collectionId={collectionId}
            onSubmit={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(
         content,
         "Hello {{{{name}}, your role is {{{{role}}"
      );

      await waitFor(() => {
         assertDetectedVariablesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing entry - rendered - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      const { container } = render(
         <TemplateEditForm
            prompt={prompt}
            globalFields={fields}
            onSubmit={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing entry - variables detected in content - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      const prompt = dtestData.dPromptWithContent();

      prompt.content = "Hello {{{{name}}, your role is {{{{role}}";

      const { container } = render(
         <TemplateEditForm
            prompt={prompt}
            globalFields={fields}
            onSubmit={jest.fn()}
         />
      );
      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesRendered();
         assertPromptVariablesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("add global field btn clicked - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} onSubmit={jest.fn()} />);

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertPromptVariablesRendered();
      });

      const globalFieldBtn = screen.getByTestId(
         "global-template-fields-picker"
      );
      await userEvent.click(globalFieldBtn);

      const fieldOption1 = screen.getAllByTestId("field-option")[0];
      await userEvent.click(fieldOption1);

      assertGlobalFieldsNotRendered();

      const addBtn = screen.getByTestId("add-fields-btn");
      await userEvent.click(addBtn);

      assertGlobalFieldsRendered();
      expect(toastMock.success).toHaveBeenCalledTimes(1);
      expect(toastMock.success).toHaveBeenCalledWith(
         "1 globale Feld(er) hinzugefügt"
      );
   });

   it("remove global field btn clicked - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      render(
         <TemplateEditForm
            prompt={prompt}
            globalFields={fields}
            onSubmit={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertPromptVariablesRendered();
         assertGlobalFieldsRendered();
      });

      const removeGlobalFieldBtn = screen.getByTestId(
         "remove-global-field-btn"
      );
      await userEvent.click(removeGlobalFieldBtn);

      await waitFor(() => {
         assertGlobalFieldsNotRendered();
      });
   });

   it("add new template field btn clicked - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} onSubmit={jest.fn()} />);

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertPromptVariablesRendered();
         assertTemplateFieldsEmptyRendered();
      });

      const variablesSection = screen.getByTestId("prompt-variables");
      const addFieldBtn = within(variablesSection).getByTestId("add-btn");

      await userEvent.click(addFieldBtn);

      await waitFor(() => {
         assertTemplateFieldRendered();
      });
   });

   it("remove template field btn clicked - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} onSubmit={jest.fn()} />);

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertPromptVariablesRendered();
         assertTemplateFieldsEmptyRendered();
      });

      const variablesSection = screen.getByTestId("prompt-variables");
      const addFieldBtn = within(variablesSection).getByTestId("add-btn");
      await userEvent.click(addFieldBtn);

      assertTemplateFieldRendered();

      const variable = screen.getByTestId("prompt-variable");
      const removeBtn = within(variable).getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         assertTemplateFieldsEmptyRendered();
      });
   });

   it("add variable as field - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} onSubmit={jest.fn()} />);

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      // const variablesTab = screen.getByTestId("variables-tab-trigger");
      // await userEvent.click(variablesTab);

      // await waitFor(() => {
      //    assertPromptVariablesRendered();
      //    assertTemplateFieldsEmptyRendered();
      // });

      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(content, "Hello {{{{name}}");

      await waitFor(() => {
         assertDetectedVariablesRendered();
      });

      const detectedVariablesSection = screen.getByTestId("detected-variables");
      const addVariableBtn = within(detectedVariablesSection).getByTestId(
         "add-btn"
      );

      await userEvent.click(addVariableBtn);

      await waitFor(() => {
         // assertTemplateFieldRendered();
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(
            'Feld "name" hinzugefügt'
         );
      });
   });

   it("sync all variables - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} onSubmit={jest.fn()} />);

      await waitFor(() => {
         assertRendered();
         assertDetectedVariablesNotRendered();
         assertPromptVariablesNotRendered();
      });

      // assertTemplateFieldsEmptyRendered();

      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(
         content,
         "Hello {{{{name}}, your role is {{{{role}} and title is  {{{{title}}"
      );

      await waitFor(() => {
         assertDetectedVariablesRendered();
      });

      const detectedVariablesSection = screen.getByTestId("detected-variables");
      const syncAllBtn = within(detectedVariablesSection).getByTestId(
         "sync-all-btn"
      );

      await userEvent.click(syncAllBtn);

      await waitFor(() => {
         expect(toastMock.success).toHaveBeenCalledTimes(4);
      });
   });
});
