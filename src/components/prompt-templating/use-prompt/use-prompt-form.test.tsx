jest.mock("@/lib/utils");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, typeIntoInput } from "@tests";

import { DPromptField, DPromptFieldType } from "@/data/types/domain/prompt";
import { openExternalUrlInNewTab } from "@/lib/utils";

import { UseTemplateForm } from "./use-prompt-form";

const openExternalUrlInNewTabMock =
   openExternalUrlInNewTab as jest.MockedFunction<
      typeof openExternalUrlInNewTab
   >;

const createField = (
   type: DPromptFieldType,
   name: string,
   label: string,
   required = false
): DPromptField => {
   return {
      id: `field-${name}`,
      promptId: "1",
      name,
      label,
      type,
      required,
      order: 1,
      defaultValue: null,
      description: null,
   };
};

const assertRendered = () => {
   const promptFromTemplate = screen.getByTestId("use-template-form");
   const preview = screen.getByTestId("prompt-preview");
   const form = screen.getByTestId("prompt-variables-form");

   const copyBtn = screen.getByTestId("copy-prompt-btn");
   const openInAiBtn = screen.getByTestId("open-in-ai-btn");

   assertInDocument(promptFromTemplate);
   assertInDocument(form);
   assertInDocument(preview);
   assertInDocument(copyBtn);
   assertInDocument(openInAiBtn);
};

describe("UseTemplateForm rendering tests", () => {
   it("renders test", async () => {
      const name = createField("TEXT", "name", "Name");
      const email = createField("EMAIL", "email", "Email Address");
      const age = createField("NUMBER", "age", "Age");
      const birthdate = createField("DATE", "birthdate", "Birth Date");
      const bio = createField("TEXTAREA", "bio", "Biography");
      const newsletter = createField("CHECKBOX", "newsletter", "Newsletter");
      const gender: DPromptField = {
         ...createField("RADIO", "gender", "Gender"),
         options: ["Male", "Female"],
      };
      const country: DPromptField = {
         ...createField("SELECT", "country", "Country"),
         options: ["CZ", "RU", "Germany"],
      };

      const fields = [
         name,
         email,
         age,
         birthdate,
         bio,
         newsletter,
         gender,
         country,
      ];

      const templateData = dtestData.dPromptGenerationData();
      templateData.allFields = fields;

      const { container } = render(
         <UseTemplateForm templateData={templateData} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UseTemplateForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("open-in-ai btn clicked - aiModel gpt - test", async () => {
      const field = createField("TEXT", "name", "Name", true);
      const templateData = dtestData.dPromptGenerationData();
      templateData.template.content = "Hello {{name}}";
      templateData.allFields.push(field);

      render(
         <UseTemplateForm
            templateData={templateData}
            recommendedModel="chatgpt"
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(openExternalUrlInNewTabMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "John Doe");

      const openInAiBtn = screen.getByTestId("open-in-ai-btn");
      await userEvent.click(openInAiBtn);

      await waitFor(() => {
         expect(openExternalUrlInNewTabMock).not.toHaveBeenCalled();
      });

      const openInGptBtn = screen.getByTestId("open-in-chatgpt-btn");
      await userEvent.click(openInGptBtn);

      const expectedUrl = "https://chatgpt.com/?q=Hello%20John%20Doe";
      await waitFor(() => {
         expect(openExternalUrlInNewTabMock).toHaveBeenCalledTimes(1);
         expect(openExternalUrlInNewTabMock).toHaveBeenCalledWith(expectedUrl);
      });
   });

   it("open-in-ai btn clicked - aiModel claude - test", async () => {
      const field = createField("TEXT", "name", "Name", true);
      const templateData = dtestData.dPromptGenerationData();
      templateData.template.content = "Hello {{name}}";
      templateData.allFields.push(field);

      render(
         <UseTemplateForm templateData={templateData} recommendedModel="gpt" />
      );

      await waitFor(() => {
         assertRendered();
         expect(openExternalUrlInNewTabMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "John Doe");

      const openInAiBtn = screen.getByTestId("open-in-ai-btn");
      await userEvent.click(openInAiBtn);

      await waitFor(() => {
         expect(openExternalUrlInNewTabMock).not.toHaveBeenCalled();
      });

      const openInClaudeBtn = screen.getByTestId("open-in-claude-btn");
      await userEvent.click(openInClaudeBtn);

      const expectedUrl = "https://claude.ai/new?q=Hello%20John%20Doe";
      await waitFor(() => {
         expect(openExternalUrlInNewTabMock).toHaveBeenCalledTimes(1);
         expect(openExternalUrlInNewTabMock).toHaveBeenCalledWith(expectedUrl);
      });
   });
});
