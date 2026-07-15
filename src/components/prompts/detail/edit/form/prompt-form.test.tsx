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
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import { getPromptCategoriesPage } from "@/data/actions/prompt";

import { PromptEditForm } from "./prompt-form";

jest.setTimeout(10000);

const getPromptCategoriesPageMock =
   getPromptCategoriesPage as jest.MockedFunction<
      typeof getPromptCategoriesPage
   >;

const assertRendered = () => {
   const form = screen.getByTestId("prompt-edit-form");
   const basicInfo = screen.getByTestId("basic-info");
   const tabs = screen.getByTestId("prompt-form-tabs");

   assertInDocument(form);
   assertInDocument(basicInfo);
   assertInDocument(tabs);
};

const assertTabsExpanded = () => {
   const tabs = screen.getByTestId("prompt-form-tabs");
   const expandBtn = screen.getByTestId("expand-editor-btn");
   const basicInfo = screen.queryByTestId("basic-info");

   assertInDocument(tabs);
   assertInDocument(expandBtn);
   assertNotInDocument(basicInfo);
};

const assertPromptVariablesRendered = () => {
   const variables = screen.getByTestId("prompt-variables");
   assertInDocument(variables);
};

const assertDetectedVariablesRendered = () => {
   const variables = screen.getByTestId("detected-variables");
   assertInDocument(variables);
};

const assertDetectedVariablesNotRendered = () => {
   const variables = screen.queryByTestId("detected-variables");
   assertNotInDocument(variables);
};

describe("PromptEditForm rendering tests", () => {
   beforeEach(() => {
      const page = dtestData.dPromptCategoriesPage();
      getPromptCategoriesPageMock.mockResolvedValue(page);
   });

   it("new entry - rendered - test", async () => {
      const { container } = renderWithReactQuery(
         <PromptEditForm globalFields={[]} onSubmit={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertDetectedVariablesNotRendered();
         assertPromptVariablesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing entry - rendered - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      const { container } = renderWithReactQuery(
         <PromptEditForm
            prompt={prompt}
            globalFields={fields}
            onSubmit={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertDetectedVariablesNotRendered();
         assertPromptVariablesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("existing entry - variables detected in content - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      const prompt = dtestData.dPromptWithContent();
      prompt.content = "Hello {{{{name}}, your role is {{{{role}}";

      const { container } = renderWithReactQuery(
         <PromptEditForm
            prompt={prompt}
            globalFields={fields}
            onSubmit={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertDetectedVariablesRendered();
         assertPromptVariablesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptEditForm functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("expand btn clicked - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      renderWithReactQuery(
         <PromptEditForm globalFields={fields} onSubmit={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      const expandBtn = screen.getByTestId("expand-editor-btn");
      await userEvent.click(expandBtn);

      await waitFor(() => {
         assertTabsExpanded();
      });

      await userEvent.click(expandBtn);

      await waitFor(() => {
         assertRendered();
      });
   });

   it("new entry - variables detected in content - test", async () => {
      const collection = dtestData.dCollectionPreview();

      renderWithReactQuery(
         <PromptEditForm
            globalFields={[]}
            currentCollection={collection}
            onSubmit={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const variablesTab = screen.getByTestId("variables-tab-trigger");
      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertDetectedVariablesNotRendered();
         assertPromptVariablesRendered();
      });

      const editorTab = screen.getByTestId("editor-tab-trigger");
      await userEvent.click(editorTab);

      await waitFor(() => {
         assertRendered();
      });

      const content = screen
         .getByTestId("tiptap-editor")
         .querySelector("input")!;

      await userEvent.type(
         content,
         "Hello {{{{name}}, your role is {{{{role}}"
      );

      await userEvent.click(variablesTab);

      await waitFor(() => {
         assertDetectedVariablesRendered();
         assertPromptVariablesRendered();
      });
   });
});
