jest.mock("@/data/actions/prompt-template");
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
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   typeIntoInput,
   typeIntoTextArea,
   typeIntoTipTap,
} from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import {
   createTemplateDescriptor,
   updateTemplateDescriptor,
} from "@/data/actions/prompt-template";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

import { LibraryEntryEditForm } from "./library-entry-edit-form";
import { initPromptTempalte } from "./utils";

jest.setTimeout(10000);

const createTemplateDescriptorMock =
   createTemplateDescriptor as jest.MockedFunction<
      typeof createTemplateDescriptor
   >;
const updateTemplateDescriptorMock =
   updateTemplateDescriptor as jest.MockedFunction<
      typeof updateTemplateDescriptor
   >;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("library-entry-edit-form");
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

describe("LibraryEntryEditForm rendering tests", () => {
   it("LibraryEntryEditForm - new entry - rendered - test", () => {
      const { container } = render(<LibraryEntryEditForm globalFields={[]} />);

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryEditForm - new entry - variables detected in content - test", async () => {
      const { container } = render(<LibraryEntryEditForm globalFields={[]} />);

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

   it("LibraryEntryEditForm - existing entry - rendered - test", () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const fields = dtestData.dGlobalTemplateFields();

      const { container } = render(
         <LibraryEntryEditForm descriptor={descriptor} globalFields={fields} />
      );

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryEditForm - existing entry - variables detected in content - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      descriptor.promptTemplate.content =
         "Hello {{{{name}}, your role is {{{{role}}";

      const { container } = render(
         <LibraryEntryEditForm descriptor={descriptor} globalFields={fields} />
      );

      assertRendered();
      assertDetectedVariablesRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("LibraryEntryEditForm - add global field btn clicked - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      render(<LibraryEntryEditForm globalFields={fields} />);

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

   it("LibraryEntryEditForm - remove global field btn clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const fields = dtestData.dGlobalTemplateFields();

      render(
         <LibraryEntryEditForm descriptor={descriptor} globalFields={fields} />
      );

      assertRendered();
      assertGlobalFieldsRendered();

      const removeGlobalFieldBtn = screen.getByTestId(
         "remove-global-field-btn"
      );
      await userEvent.click(removeGlobalFieldBtn);

      assertGlobalFieldsNotRendered();
   });

   it("LibraryEntryEditForm - add new template field btn clicked - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      render(<LibraryEntryEditForm globalFields={fields} />);

      assertRendered();
      assertTemplateFieldsEmptyRendered();

      const fieldsSection = screen.getByTestId("prompt-template-fields");
      const addFieldBtn = within(fieldsSection).getByTestId("add-btn");

      await userEvent.click(addFieldBtn);

      await waitFor(() => {
         assertTemplateFieldRendered();
      });
   });

   it("LibraryEntryEditForm - remove template field btn clicked - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      render(<LibraryEntryEditForm globalFields={fields} />);

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

   it("LibraryEntryEditForm - add variable as field - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      render(<LibraryEntryEditForm globalFields={fields} />);

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

   it("LibraryEntryEditForm - sync all variables - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      render(<LibraryEntryEditForm globalFields={fields} />);

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

   it("LibraryEntryEditForm - new entry - save btn clicked  - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      createTemplateDescriptorMock.mockResolvedValue(result);

      const fields = dtestData.dGlobalTemplateFields();
      render(<LibraryEntryEditForm globalFields={fields} />);

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      expect(createTemplateDescriptorMock).not.toHaveBeenCalled();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");
      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedPayload: DPromptTemplateUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      await waitFor(() => {
         expect(createTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(createTemplateDescriptorMock).toHaveBeenCalledWith(
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/templates");
      });
   });

   it("LibraryEntryEditForm - existing entry - save btn clicked  - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      updateTemplateDescriptorMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const fields = dtestData.dGlobalTemplateFields();

      render(
         <LibraryEntryEditForm descriptor={descriptor} globalFields={fields} />
      );

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const initValue = initPromptTempalte(descriptor);
      const expectedPayload: DPromptTemplateUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         globalFieldIds: initValue.globalFieldIds,
         recommendedModel: initValue.recommendedModel,
      };

      await waitFor(() => {
         expect(updateTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(updateTemplateDescriptorMock).toHaveBeenCalledWith(
            descriptor.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual(`/library/${descriptor.id}`);
      });
   });

   it("LibraryEntryEditForm - new entry - save btn clicked  - failed - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      createTemplateDescriptorMock.mockResolvedValue(result);

      const fields = dtestData.dGlobalTemplateFields();
      render(<LibraryEntryEditForm globalFields={fields} />);

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      expect(createTemplateDescriptorMock).not.toHaveBeenCalled();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedPayload: DPromptTemplateUpdate = {
         title: "Test Template",
         description: "Test Description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         globalFieldIds: [],
         recommendedModel: "Claude",
      };

      await waitFor(() => {
         expect(createTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(createTemplateDescriptorMock).toHaveBeenCalledWith(
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });

   it("LibraryEntryEditForm - existing entry - save btn clicked  - failed - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      updateTemplateDescriptorMock.mockResolvedValue(result);

      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const fields = dtestData.dGlobalTemplateFields();

      render(
         <LibraryEntryEditForm descriptor={descriptor} globalFields={fields} />
      );

      assertRendered();

      // Fill in required fields
      await typeIntoInput("title", "Test Template");
      await typeIntoTextArea("description", "Test Description");

      await typeIntoTipTap("tiptap-editor", "Template Content {{{{task}}");

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const initValue = initPromptTempalte(descriptor);
      const expectedPayload: DPromptTemplateUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         globalFieldIds: initValue.globalFieldIds,
         recommendedModel: initValue.recommendedModel,
      };

      await waitFor(() => {
         expect(updateTemplateDescriptorMock).toHaveBeenCalledTimes(1);
         expect(updateTemplateDescriptorMock).toHaveBeenCalledWith(
            descriptor.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });
});
