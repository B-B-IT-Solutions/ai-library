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

import { DetailedHTMLProps, InputHTMLAttributes, MouseEvent } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   typeIntoInput,
   typeIntoTextArea,
   typeIntoTipTap,
} from "@tests";
import mockRouter from "next-router-mock";
import { Action, ExternalToast, toast } from "sonner";

import { createPrompt, updatePrompt } from "@/data/actions/prompt";
import {
   DPrompt,
   DPromptUpdate,
   DPromptUpdateCrate,
} from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";

import { TemplateEditForm } from "./template-edit-form";
import { initPromptTemplate } from "./utils";

jest.setTimeout(10000);

const createPromptMock = createPrompt as jest.MockedFunction<
   typeof createPrompt
>;
const updatePromptMock = updatePrompt as jest.MockedFunction<
   typeof updatePrompt
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("template-edit-form");
   const basicInfo = screen.getByTestId("basic-info");
   const templateContent = screen.getByTestId("prompt-template-content");
   const fields = screen.getByTestId("prompt-template-fields");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const saveBtn = screen.getByTestId("save-btn");

   assertInDocument(form);
   assertInDocument(basicInfo);
   assertInDocument(templateContent);
   assertInDocument(fields);
   assertInDocument(cancelBtn);
   assertInDocument(saveBtn);
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
   const field = screen.queryByTestId("prompt-template-field");
   assertInDocument(fieldsEmpty);
   assertNotInDocument(field);
};

const assertTemplateFieldRendered = () => {
   const field = screen.getByTestId("prompt-template-field");
   const fieldsEmpty = screen.queryByTestId("fields-empty");

   assertInDocument(field);
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
   it("new entry - rendered - test", () => {
      const { container } = render(<TemplateEditForm globalFields={[]} />);

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("new entry - variables detected in content - test", async () => {
      const { container } = render(<TemplateEditForm globalFields={[]} />);

      assertRendered();
      assertDetectedVariablesNotRendered();

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

   it("existing entry - rendered - test", () => {
      const prompt = dtestData.dPrompt();
      const template = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      const { container } = render(
         <TemplateEditForm
            prompt={prompt}
            template={template}
            globalFields={fields}
         />
      );

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("existing entry - variables detected in content - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      const descriptor = dtestData.dPrompt();
      const template = dtestData.dPromptWithContent();

      template.content = "Hello {{{{name}}, your role is {{{{role}}";

      const { container } = render(
         <TemplateEditForm
            prompt={descriptor}
            template={template}
            globalFields={fields}
         />
      );

      assertRendered();
      assertDetectedVariablesRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("add global field btn clicked - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} />);

      assertRendered();
      assertGlobalFieldsNotRendered();

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
      const descriptor = dtestData.dPrompt();
      const template = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      render(
         <TemplateEditForm
            prompt={descriptor}
            template={template}
            globalFields={fields}
         />
      );

      assertRendered();
      assertGlobalFieldsRendered();

      const removeGlobalFieldBtn = screen.getByTestId(
         "remove-global-field-btn"
      );
      await userEvent.click(removeGlobalFieldBtn);

      assertGlobalFieldsNotRendered();
   });

   it("add new template field btn clicked - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} />);

      assertRendered();
      assertTemplateFieldsEmptyRendered();

      const fieldsSection = screen.getByTestId("prompt-template-fields");
      const addFieldBtn = within(fieldsSection).getByTestId("add-btn");

      await userEvent.click(addFieldBtn);

      await waitFor(() => {
         assertTemplateFieldRendered();
      });
   });

   it("remove template field btn clicked - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} />);

      assertRendered();
      assertTemplateFieldsEmptyRendered();

      const fieldsSection = screen.getByTestId("prompt-template-fields");
      const addFieldBtn = within(fieldsSection).getByTestId("add-btn");
      await userEvent.click(addFieldBtn);

      assertTemplateFieldRendered();

      const field = screen.getByTestId("prompt-template-field");
      const removeBtn = within(field).getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         assertTemplateFieldsEmptyRendered();
      });
   });

   it("add variable as field - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} />);

      assertRendered();
      assertDetectedVariablesNotRendered();
      assertTemplateFieldsEmptyRendered();

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
         assertTemplateFieldRendered();
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(
            'Feld "name" hinzugefügt'
         );
      });
   });

   it("sync all variables - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} />);

      assertRendered();
      assertDetectedVariablesNotRendered();
      assertTemplateFieldsEmptyRendered();

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

   it("new entry - save btn clicked - success - test", async () => {
      const newPrompt = dtestData.dPrompt();
      const result: ActionResult<DPrompt> = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
         data: newPrompt,
      };
      createPromptMock.mockResolvedValue(result);

      const fields = dtestData.dGlobalPromptFields();
      render(<TemplateEditForm globalFields={fields} />);

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      expect(createPromptMock).not.toHaveBeenCalled();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedData: DPromptUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      const expectedPayload: DPromptUpdateCrate = {
         data: expectedData,
      };

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(createPromptMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual(`/templates/${newPrompt.id}`);
      });
   });

   it("existing entry - save btn clicked - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      updatePromptMock.mockResolvedValue(result);

      const descriptor = dtestData.dPrompt();
      const template = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      render(
         <TemplateEditForm
            prompt={descriptor}
            template={template}
            globalFields={fields}
         />
      );

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const initValue = initPromptTemplate(descriptor, template);
      const expectedPayload: DPromptUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         globalFieldIds: initValue.globalFieldIds,
         recommendedModel: initValue.recommendedModel,
      };

      await waitFor(() => {
         expect(updatePromptMock).toHaveBeenCalledTimes(1);
         expect(updatePromptMock).toHaveBeenCalledWith(
            descriptor.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual(`/templates/${descriptor.id}`);
      });
   });

   it("new entry - save btn clicked - failed - upgradeRequired - test", async () => {
      const result: ActionResult<DPrompt> = {
         success: false,
         message: "Limit erreicht. Bitte upgrade dein Abo.",
         upgradeRequired: true,
      };
      createPromptMock.mockResolvedValue(result);

      const collectionId = "collection-id-1";

      const fields = dtestData.dGlobalPromptFields();
      render(
         <TemplateEditForm globalFields={fields} collectionId={collectionId} />
      );

      assertRendered();

      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedData: DPromptUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      const expectedPayload: DPromptUpdateCrate = {
         data: expectedData,
         collectionId,
      };

      const expectedToastPayload = {
         action: {
            label: "Upgrade",
            onClick: expect.any(Function),
         },
      };

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(createPromptMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            result.message,
            expectedToastPayload
         );
         expect(mockRouter.pathname).toEqual("/");
      });

      const toastCall = toastMock.error.mock.calls[0];
      const toastOptions = toastCall[1] as ExternalToast;
      const action = toastOptions.action as Action;
      const event = null as unknown as MouseEvent<HTMLButtonElement>;
      action.onClick(event);

      expect(mockRouter.asPath).toEqual("/subscription/pricing");
   });

   it("new entry - save btn clicked - failed - test", async () => {
      const result: ActionResult<DPrompt> = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      createPromptMock.mockResolvedValue(result);

      const fields = dtestData.dGlobalPromptFields();
      const collectionId = "collection-id-123";

      render(
         <TemplateEditForm globalFields={fields} collectionId={collectionId} />
      );

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      expect(createPromptMock).not.toHaveBeenCalled();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedData: DPromptUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      const expectedPayload: DPromptUpdateCrate = {
         data: expectedData,
         collectionId,
      };

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(createPromptMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });

   it("existing entry - save btn clicked  - failed - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      updatePromptMock.mockResolvedValue(result);

      const descriptor = dtestData.dPrompt();
      const template = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      render(
         <TemplateEditForm
            prompt={descriptor}
            template={template}
            globalFields={fields}
         />
      );

      assertRendered();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const initValue = initPromptTemplate(descriptor, template);
      const expectedPayload: DPromptUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         globalFieldIds: initValue.globalFieldIds,
         recommendedModel: initValue.recommendedModel,
      };

      await waitFor(() => {
         expect(updatePromptMock).toHaveBeenCalledTimes(1);
         expect(updatePromptMock).toHaveBeenCalledWith(
            descriptor.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });

   it("new entry - collectionId - save btn clicked - success - test", async () => {
      const newPrompt = dtestData.dPrompt();
      const createResult: ActionResult<DPrompt> = {
         success: true,
         message: "Prompt erfolgreich erstellt",
         data: newPrompt,
      };
      createPromptMock.mockResolvedValue(createResult);

      const collectionId = "457bf695-6f74-44aa-9b3a-e179ea9e8171";
      const fields = dtestData.dGlobalPromptFields();
      render(
         <TemplateEditForm globalFields={fields} collectionId={collectionId} />
      );

      assertRendered();

      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(createResult.message);
         expect(mockRouter.pathname).toEqual(`/collections/${collectionId}`);
      });
   });

   it("new entry - collectionId - save btn clicked - failed - test", async () => {
      const newPrompt = dtestData.dPrompt();
      const createResult: ActionResult<DPrompt> = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
         data: newPrompt,
      };
      createPromptMock.mockResolvedValue(createResult);

      const collectionId = "457bf695-6f74-44aa-9b3a-e179ea9e8171";
      const fields = dtestData.dGlobalPromptFields();
      render(
         <TemplateEditForm globalFields={fields} collectionId={collectionId} />
      );

      assertRendered();

      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(createPromptMock).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(mockRouter.pathname).toEqual(`/templates/${newPrompt.id}`);
      });
   });
});
