jest.mock("@/data/actions/library");
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
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { createLibraryEntry, updateLibraryEntry } from "@/data/actions/library";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

import { LibraryEntryForm } from "./new-library-entry-form";
import { initPromptTempalte } from "./utils";

const createLibraryEntryMock = createLibraryEntry as jest.MockedFunction<
   typeof createLibraryEntry
>;
const updateLibraryEntryMock = updateLibraryEntry as jest.MockedFunction<
   typeof updateLibraryEntry
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

const assertFieldsEmptyRendered = () => {
   const fieldsEmpty = screen.getByTestId("fields-empty");
   const field = screen.queryByTestId("prompt-template-field");
   assertInDocument(fieldsEmpty);
   assertNotInDocument(field);
};

const assertFieldRendered = () => {
   const field = screen.getByTestId("prompt-template-field");
   const fieldsEmpty = screen.queryByTestId("fields-empty");

   assertInDocument(field);
   assertNotInDocument(fieldsEmpty);
};

describe("LibraryEntryForm rendering tests", () => {
   it("LibraryEntryForm - new entry - rendered - test", () => {
      const { container } = render(<LibraryEntryForm />);

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryForm - new entry - variables detected in content - test", async () => {
      const { container } = render(<LibraryEntryForm />);

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

   it("LibraryEntryForm - existing entry - rendered - test", () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      const { container } = render(<LibraryEntryForm entry={entry} />);

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryForm - existing entry - variables detected in content - test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      entry.templateDescriptor.promptTemplate.content =
         "Hello {{{{name}}, your role is {{{{role}}";

      const { container } = render(<LibraryEntryForm entry={entry} />);

      assertRendered();
      assertDetectedVariablesRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("LibraryEntryForm - add new field btn clicked - test", async () => {
      render(<LibraryEntryForm />);

      assertRendered();
      assertFieldsEmptyRendered();

      const fieldsSection = screen.getByTestId("prompt-template-fields");
      const addFieldBtn = within(fieldsSection).getByTestId("add-btn");

      await userEvent.click(addFieldBtn);

      await waitFor(() => {
         assertFieldRendered();
      });
   });

   it("LibraryEntryForm - remove field btn clicked - test", async () => {
      render(<LibraryEntryForm />);

      assertRendered();
      assertFieldsEmptyRendered();

      const fieldsSection = screen.getByTestId("prompt-template-fields");
      const addFieldBtn = within(fieldsSection).getByTestId("add-btn");
      await userEvent.click(addFieldBtn);

      assertFieldRendered();

      const field = screen.getByTestId("prompt-template-field");
      const removeBtn = within(field).getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      await waitFor(() => {
         assertFieldsEmptyRendered();
      });
   });

   it("LibraryEntryForm - add variable as field - test", async () => {
      render(<LibraryEntryForm />);

      assertRendered();
      assertDetectedVariablesNotRendered();
      assertFieldsEmptyRendered();

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
         assertFieldRendered();
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(
            'Feld "name" hinzugefügt'
         );
      });
   });

   it("LibraryEntryForm - sync all variables - test", async () => {
      render(<LibraryEntryForm />);

      assertRendered();
      assertDetectedVariablesNotRendered();
      assertFieldsEmptyRendered();

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

   it("LibraryEntryForm - new entry - save btn clicked  - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      createLibraryEntryMock.mockResolvedValue(result);

      render(<LibraryEntryForm />);

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      expect(createLibraryEntryMock).not.toHaveBeenCalled();

      // Fill in required fields
      const title = screen.getByTestId("title");
      const titleInput = within(title).getByTestId("input");
      const description = screen.getByTestId("description");
      const descriptionTextarea = within(description).getByTestId("textarea");
      const detailedDescription = screen.getByTestId("detailedDescription");
      const detailedDescriptionTextarea =
         within(detailedDescription).getByTestId("textarea");
      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(titleInput, "Test Template");
      await userEvent.type(descriptionTextarea, "Test Description");
      await userEvent.type(detailedDescriptionTextarea, "Detailed description");
      await userEvent.type(content, "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedPayload: DPromptTemplateUpdate = {
         title: "Test Template",
         description: "Test Description",
         detailedDescription: "Detailed description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         recommendedModel: "Claude 3.5 Sonnet",
         categoryInput: "",
      };

      await waitFor(() => {
         expect(createLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(createLibraryEntryMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/library");
      });
   });

   it("LibraryEntryForm - existing entry - save btn clicked  - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      updateLibraryEntryMock.mockResolvedValue(result);

      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      render(<LibraryEntryForm entry={entry} />);

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");

      // Fill in required fields
      const title = screen.getByTestId("title");
      const titleInput = within(title).getByTestId("input");
      const description = screen.getByTestId("description");
      const descriptionTextarea = within(description).getByTestId("textarea");
      const detailedDescription = screen.getByTestId("detailedDescription");
      const detailedDescriptionTextarea =
         within(detailedDescription).getByTestId("textarea");
      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(titleInput, "Test Template");
      await userEvent.type(descriptionTextarea, "Test Description");
      await userEvent.type(detailedDescriptionTextarea, "Detailed description");
      await userEvent.type(content, "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const initValue = initPromptTempalte(entry);
      const expectedPayload: DPromptTemplateUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         detailedDescription:
            initValue.detailedDescription + "Detailed description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         recommendedModel: initValue.recommendedModel,
         categoryInput: "",
      };

      await waitFor(() => {
         expect(updateLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(updateLibraryEntryMock).toHaveBeenCalledWith(
            entry.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual(`/library/${entry.id}`);
      });
   });

   it("LibraryEntryForm - new entry - save btn clicked  - failed - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      createLibraryEntryMock.mockResolvedValue(result);

      render(<LibraryEntryForm />);

      assertRendered();

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      expect(createLibraryEntryMock).not.toHaveBeenCalled();

      // Fill in required fields
      const title = screen.getByTestId("title");
      const titleInput = within(title).getByTestId("input");
      const description = screen.getByTestId("description");
      const descriptionTextarea = within(description).getByTestId("textarea");
      const detailedDescription = screen.getByTestId("detailedDescription");
      const detailedDescriptionTextarea =
         within(detailedDescription).getByTestId("textarea");
      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(titleInput, "Test Template");
      await userEvent.type(descriptionTextarea, "Test Description");
      await userEvent.type(detailedDescriptionTextarea, "Detailed description");
      await userEvent.type(content, "Template Content {{{{task}}");

      await userEvent.click(saveBtn);

      const expectedPayload: DPromptTemplateUpdate = {
         title: "Test Template",
         description: "Test Description",
         detailedDescription: "Detailed description",
         content: "Template Content {{task}}",
         categories: [],
         fields: [],
         recommendedModel: "Claude 3.5 Sonnet",
         categoryInput: "",
      };

      await waitFor(() => {
         expect(createLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(createLibraryEntryMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });

   it("LibraryEntryForm - existing entry - save btn clicked  - failed - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      updateLibraryEntryMock.mockResolvedValue(result);

      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      render(<LibraryEntryForm entry={entry} />);

      assertRendered();

      // Fill in required fields
      const title = screen.getByTestId("title");
      const titleInput = within(title).getByTestId("input");
      const description = screen.getByTestId("description");
      const descriptionTextarea = within(description).getByTestId("textarea");
      const detailedDescription = screen.getByTestId("detailedDescription");
      const detailedDescriptionTextarea =
         within(detailedDescription).getByTestId("textarea");
      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(titleInput, "Test Template");
      await userEvent.type(descriptionTextarea, "Test Description");
      await userEvent.type(detailedDescriptionTextarea, "Detailed description");
      await userEvent.type(content, "Template Content {{{{task}}");

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const initValue = initPromptTempalte(entry);
      const expectedPayload: DPromptTemplateUpdate = {
         title: initValue.title + "Test Template",
         description: initValue.description + "Test Description",
         detailedDescription:
            initValue.detailedDescription + "Detailed description",
         content: initValue.content + "Template Content {{task}}",
         categories: initValue.categories,
         fields: initValue.fields,
         recommendedModel: initValue.recommendedModel,
         categoryInput: "",
      };

      await waitFor(() => {
         expect(updateLibraryEntryMock).toHaveBeenCalledTimes(1);
         expect(updateLibraryEntryMock).toHaveBeenCalledWith(
            entry.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });
});
