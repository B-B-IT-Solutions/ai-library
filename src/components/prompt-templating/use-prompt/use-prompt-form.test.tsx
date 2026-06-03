jest.mock("@/lib/utils");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   typeIntoInput,
} from "@tests";

import {
   DPromptVariable,
   DPromptVariableType,
} from "@/data/types/domain/prompt";
import { openExternalUrlInNewTab } from "@/lib/utils";

import { UsePromptForm } from "./use-prompt-form";

const openExternalUrlInNewTabMock =
   openExternalUrlInNewTab as jest.MockedFunction<
      typeof openExternalUrlInNewTab
   >;

const createField = (
   type: DPromptVariableType,
   name: string,
   label: string,
   required = false
): DPromptVariable => {
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

   const copyBtn = screen.getByTestId("copy-prompt-btn");
   const openInAiBtn = screen.getByTestId("open-in-ai-btn");

   assertInDocument(promptFromTemplate);
   assertInDocument(preview);
   assertInDocument(copyBtn);
   assertInDocument(openInAiBtn);
};

const assertFormRendered = () => {
   const form = screen.getByTestId("prompt-variables-form");
   assertInDocument(form);
};

const assertFormNotRendered = () => {
   const form = screen.queryByTestId("prompt-variables-form");
   assertNotInDocument(form);
};

const assertRequiredFieldProgressRendered = () => {
   const progress = screen.getByTestId("required-fields-progress");
   assertInDocument(progress);
};

const assertRequiredFieldProgressNotRendered = () => {
   const progress = screen.queryByTestId("required-fields-progress");
   assertNotInDocument(progress);
};

describe("UsePromptForm rendering tests", () => {
   it("fields empty - test", async () => {
      const templateData = dtestData.dPromptGenerationData();
      templateData.allFields = [];

      const { container } = render(
         <UsePromptForm templateData={templateData} />
      );

      await waitFor(() => {
         assertRendered();
         assertFormNotRendered();
         assertRequiredFieldProgressNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("one field - required false - test", async () => {
      const name = createField("TEXT", "name", "Name");

      const fields = [name];

      const templateData = dtestData.dPromptGenerationData();
      templateData.allFields = fields;

      const { container } = render(
         <UsePromptForm templateData={templateData} />
      );

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         assertRequiredFieldProgressNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("one field - required true - test", async () => {
      const name = createField("TEXT", "name", "Name", true);
      const fields = [name];

      const templateData = dtestData.dPromptGenerationData();
      templateData.allFields = fields;

      const { container } = render(
         <UsePromptForm templateData={templateData} />
      );

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         assertRequiredFieldProgressRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("multiple fields - required false - test", async () => {
      const name = createField("TEXT", "name", "Name");
      const email = createField("EMAIL", "email", "Email Address");
      const age = createField("NUMBER", "age", "Age");
      const birthdate = createField("DATE", "birthdate", "Birth Date");
      const bio = createField("TEXTAREA", "bio", "Biography");
      const newsletter = createField("CHECKBOX", "newsletter", "Newsletter");
      const gender: DPromptVariable = {
         ...createField("RADIO", "gender", "Gender"),
         options: ["Male", "Female"],
      };
      const country: DPromptVariable = {
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
         <UsePromptForm templateData={templateData} />
      );

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         assertRequiredFieldProgressNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("multiple fields - required true - test", async () => {
      const name = createField("TEXT", "name", "Name", true);
      const email = createField("EMAIL", "email", "Email Address", true);
      const age = createField("NUMBER", "age", "Age");
      const birthdate = createField("DATE", "birthdate", "Birth Date");
      const bio = createField("TEXTAREA", "bio", "Biography");
      const newsletter = createField("CHECKBOX", "newsletter", "Newsletter");
      const gender: DPromptVariable = {
         ...createField("RADIO", "gender", "Gender", true),
         options: ["Male", "Female"],
      };
      const country: DPromptVariable = {
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
         <UsePromptForm templateData={templateData} />
      );

      await waitFor(() => {
         assertRendered();
         assertFormRendered();
         assertRequiredFieldProgressRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UsePromptForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("open-in-ai btn clicked - aiModel gpt - test", async () => {
      const field = createField("TEXT", "name", "Name", true);
      const templateData = dtestData.dPromptGenerationData();
      templateData.template.content = "Hello {{name}}";
      templateData.allFields.push(field);

      render(
         <UsePromptForm
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
         <UsePromptForm templateData={templateData} recommendedModel="gpt" />
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
