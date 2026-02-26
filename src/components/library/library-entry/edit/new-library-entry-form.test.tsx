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
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { createLibraryEntry } from "@/data/actions/library";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

import { LibraryEntryForm } from "./new-library-entry-form";

const createLibraryEntryMock = createLibraryEntry as jest.MockedFunction<
   typeof createLibraryEntry
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("library-entry-edit-form");
   const basicInfo = screen.getByTestId("basic-info");
   const templateContent = screen.getByTestId("prompt-template-content");
   const fields = screen.getByTestId("prompt-template-fields");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const createBtn = screen.getByTestId("create-btn");

   assertInDocument(form);
   assertInDocument(basicInfo);
   assertInDocument(templateContent);
   assertInDocument(fields);
   assertInDocument(cancelBtn);
   assertInDocument(createBtn);
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

describe("NewLibraryEntryForm rendering tests", () => {
   it("NewLibraryEntryForm - rendered - test", () => {
      const { container } = render(<LibraryEntryForm />);

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });

   it("NewLibraryEntryForm - variables detected in content - test", async () => {
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
});

describe("NewLibraryEntryForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("NewLibraryEntryForm - add new field btn clicked - test", async () => {
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

   it("NewLibraryEntryForm - remove field btn clicked - test", async () => {
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

   it("NewLibraryEntryForm - add variable as field - test", async () => {
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

   it("NewLibraryEntryForm - sync all variables - test", async () => {
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

   it("NewLibraryEntryForm - create btn clicked  - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
      createLibraryEntryMock.mockResolvedValue(result);

      render(<LibraryEntryForm />);

      assertRendered();

      const createBtn = screen.getByTestId("create-btn");
      await userEvent.click(createBtn);

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

      await userEvent.click(createBtn);

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

   it("NewLibraryEntryForm - create btn clicked  - failed - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      createLibraryEntryMock.mockResolvedValue(result);

      render(<LibraryEntryForm />);

      assertRendered();

      const createBtn = screen.getByTestId("create-btn");
      await userEvent.click(createBtn);

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

      await userEvent.click(createBtn);

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
});
