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
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { createCustomTemplate } from "@/data/actions/library";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

import { NewLibraryEntryForm } from "./new-library-entry-form";

const createCustomTemplateMock = createCustomTemplate as jest.MockedFunction<
   typeof createCustomTemplate
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("new-library-entry-form");
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
      const { container } = render(<NewLibraryEntryForm />);

      assertRendered();
      assertDetectedVariablesNotRendered();

      expect(container).toMatchSnapshot();
   });
});

describe("NewLibraryEntryForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      mockRouter.push("/");
   });

   it("NewLibraryEntryForm - add new field btn clicked - test", async () => {
      render(<NewLibraryEntryForm />);

      assertRendered();
      assertFieldsEmptyRendered();

      const fieldsSection = screen.getByTestId("prompt-template-fields");
      const addFieldBtn = within(fieldsSection).getByTestId("add-btn");

      await userEvent.click(addFieldBtn);

      assertFieldRendered();
   });

   it("NewLibraryEntryForm - remove field btn clicked - test", async () => {
      render(<NewLibraryEntryForm />);

      assertRendered();
      assertFieldsEmptyRendered();

      const fieldsSection = screen.getByTestId("prompt-template-fields");
      const addFieldBtn = within(fieldsSection).getByTestId("add-btn");
      await userEvent.click(addFieldBtn);

      assertFieldRendered();

      const field = screen.getByTestId("prompt-template-field");
      const removeBtn = within(field).getByTestId("remove-btn");
      await userEvent.click(removeBtn);

      assertFieldsEmptyRendered();
   });

   it("NewLibraryEntryForm - create btn clicked  - success - test", async () => {
      const result: ActionResult<string> = {
         success: true,
         message: "Vorlage erfolgreich erstellt",
         data: "test-id",
      };
      createCustomTemplateMock.mockResolvedValue(result);

      render(<NewLibraryEntryForm />);

      assertRendered();

      const createBtn = screen.getByTestId("create-btn");
      await userEvent.click(createBtn);

      expect(createCustomTemplateMock).not.toHaveBeenCalled();

      // Fill in required fields
      const title = screen.getByTestId("title").querySelector("input")!;
      const description = screen
         .getByTestId("description")
         .querySelector("textarea")!;
      const detailedDescription = screen
         .getByTestId("detailedDescription")
         .querySelector("textarea")!;
      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(title, "Test Template");
      await userEvent.type(description, "Test Description");
      await userEvent.type(detailedDescription, "Detailed description");
      await userEvent.type(content, "Template Content");

      await userEvent.click(createBtn);

      const expectedPayload: DPromptTemplateUpdate = {
         title: "Test Template",
         description: "Test Description",
         detailedDescription: "Detailed description",
         content: "Template Content",
         categories: [],
         fields: [],
         recommendedModel: "Claude 3.5 Sonnet",
      };

      expect(createCustomTemplateMock).toHaveBeenCalledTimes(1);
      expect(createCustomTemplateMock).toHaveBeenCalledWith(expectedPayload);
      expect(toastMock.success).toHaveBeenCalledTimes(1);
      expect(toastMock.success).toHaveBeenCalledWith(result.message);
      expect(mockRouter.pathname).toEqual("/library");
   });

   it("NewLibraryEntryForm - create btn clicked  - failed - test", async () => {
      const result: ActionResult<string> = {
         success: false,
         message: "Vorlage erfolgreich erstellt",
      };
      createCustomTemplateMock.mockResolvedValue(result);

      render(<NewLibraryEntryForm />);

      assertRendered();

      const createBtn = screen.getByTestId("create-btn");
      await userEvent.click(createBtn);

      expect(createCustomTemplateMock).not.toHaveBeenCalled();

      // Fill in required fields
      const title = screen.getByTestId("title").querySelector("input")!;
      const description = screen
         .getByTestId("description")
         .querySelector("textarea")!;
      const detailedDescription = screen
         .getByTestId("detailedDescription")
         .querySelector("textarea")!;
      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(title, "Test Template");
      await userEvent.type(description, "Test Description");
      await userEvent.type(detailedDescription, "Detailed description");
      await userEvent.type(content, "Template Content");

      await userEvent.click(createBtn);

      const expectedPayload: DPromptTemplateUpdate = {
         title: "Test Template",
         description: "Test Description",
         detailedDescription: "Detailed description",
         content: "Template Content",
         categories: [],
         fields: [],
         recommendedModel: "Claude 3.5 Sonnet",
      };

      expect(createCustomTemplateMock).toHaveBeenCalledTimes(1);
      expect(createCustomTemplateMock).toHaveBeenCalledWith(expectedPayload);
      expect(toastMock.error).toHaveBeenCalledTimes(1);
      expect(toastMock.error).toHaveBeenCalledWith(result.message);
      expect(mockRouter.pathname).toEqual("/");
   });
});
