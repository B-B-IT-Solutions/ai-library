jest.mock("@/lib/utils");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, typeIntoInput } from "@tests";

import {
   DPromptTemplateField,
   DPromptTemplateFieldType,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { openExternalUrlInNewTab } from "@/lib/utils";

import { PromptFromTemplate } from "./prompt-from-template";

const openExternalUrlInNewTabMock =
   openExternalUrlInNewTab as jest.MockedFunction<
      typeof openExternalUrlInNewTab
   >;

const createField = (
   type: DPromptTemplateFieldType,
   name: string,
   label: string,
   required = false
): DPromptTemplateField => {
   return {
      id: `field-${name}`,
      promptTemplateId: "1",
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
   const promptFromTemplate = screen.getByTestId("prompt-from-template");
   const preview = screen.getByTestId("template-preview");
   const form = screen.getByTestId("template-fields-form");

   const copyBtn = screen.getByTestId("copy-prompt-btn");
   const openInAiBtn = screen.getByTestId("open-in-ai-btn");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(promptFromTemplate);
   assertInDocument(form);
   assertInDocument(preview);
   assertInDocument(copyBtn);
   assertInDocument(openInAiBtn);
   assertInDocument(submitBtn);
};

describe("PromptFromTemplate rendering tests", () => {
   it("PromptFromTemplate renders test", async () => {
      const name = createField("TEXT", "name", "Name");
      const email = createField("EMAIL", "email", "Email Address");
      const age = createField("NUMBER", "age", "Age");
      const birthdate = createField("DATE", "birthdate", "Birth Date");
      const bio = createField("TEXTAREA", "bio", "Biography");
      const newsletter = createField("CHECKBOX", "newsletter", "Newsletter");
      const gender: DPromptTemplateField = {
         ...createField("RADIO", "gender", "Gender"),
         options: ["Male", "Female"],
      };
      const country: DPromptTemplateField = {
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

      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      templateData.allFields = fields;

      const onSubmit = jest.fn();

      const { container } = render(
         <PromptFromTemplate templateData={templateData} onSubmit={onSubmit} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptFromTemplate functionality tests", () => {
   it("PromptFromTemplate - submit btn clicked - test", async () => {
      const field = createField("TEXT", "name", "Name", true);
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      templateData.allFields.push(field);

      const onSubmit = jest.fn();

      render(
         <PromptFromTemplate templateData={templateData} onSubmit={onSubmit} />
      );

      await waitFor(() => {
         assertRendered();
         expect(onSubmit).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(onSubmit).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "John Doe");

      await userEvent.click(submitBtn);

      const expectedPayload: DPromptTemplateFieldValues = {
         name: "John Doe",
         field_0: "option 1",
         field_1: "option 1",
         field_2: "option 1",
      };

      await waitFor(() => {
         expect(onSubmit).toHaveBeenCalledTimes(1);
         expect(onSubmit).toHaveBeenCalledWith(expectedPayload);
      });
   });

   it("PromptFromTemplate - open-in-ai btn clicked - test", async () => {
      const field = createField("TEXT", "name", "Name", true);
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      templateData.template.content = "Hello {{name}}";
      templateData.allFields.push(field);

      render(
         <PromptFromTemplate
            templateData={templateData}
            onSubmit={jest.fn()}
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

      const openInGptBtn = screen.getByTestId("open-in-gpt-btn");
      await userEvent.click(openInGptBtn);

      const expectedUrl = "https://chatgpt.com/?q=Hello%20John%20Doe";
      await waitFor(() => {
         expect(openExternalUrlInNewTabMock).toHaveBeenCalledTimes(1);
         expect(openExternalUrlInNewTabMock).toHaveBeenCalledWith(expectedUrl);
      });
   });
});
