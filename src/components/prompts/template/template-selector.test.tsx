jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/data/actions/prompt";

import { TemplateSelector } from "./template-selector";

const getPromptTemplatesMock = getPromptTemplates as jest.MockedFunction<
   typeof getPromptTemplates
>;

const getPromptTemplateCategoriesMock =
   getPromptTemplateCategories as jest.MockedFunction<
      typeof getPromptTemplateCategories
   >;

const assertRendered = () => {
   const templateSelector = screen.getByTestId("template-selector");
   const showTemplatesBtn = screen.getByTestId("show-templates-btn");

   assertInDocument(templateSelector);
   assertInDocument(showTemplatesBtn);
};

const assertTemplatesRendered = () => {
   const templatesView = screen.getByTestId("templates-view");
   assertInDocument(templatesView);
};

const assertTemplatesNotRendered = () => {
   const templatesView = screen.queryByTestId("templates-view");
   assertNotInDocument(templatesView);
};

describe("TemplateSelector rendering tests", () => {
   it("TemplateSelector rendered test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      const categories = ["category 1", "category 2", "category 3"];

      getPromptTemplatesMock.mockResolvedValue(templates);
      getPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const { container } = renderWithReactQuery(
         <TemplateSelector onSelect={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
         assertTemplatesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateSelector functionality tests", () => {
   it("TemplateSelector - template clicked = test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      const categories = ["category 1", "category 2", "category 3"];

      getPromptTemplatesMock.mockResolvedValue(templates);
      getPromptTemplateCategoriesMock.mockResolvedValue(categories);
      const onSelectFn = jest.fn();

      renderWithReactQuery(<TemplateSelector onSelect={onSelectFn} />);

      await waitFor(() => {
         assertRendered();
         assertTemplatesNotRendered();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const showTemplatesBtn = screen.getByTestId("show-templates-btn");
      userEvent.click(showTemplatesBtn);

      await waitFor(() => {
         assertTemplatesRendered();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const card = screen.getAllByTestId("template-card")[0];
      userEvent.click(card);

      await waitFor(() => {
         expect(onSelectFn).toHaveBeenCalledTimes(1);
         expect(onSelectFn).toHaveBeenCalledWith(templates[0]);
      });
   });
});
