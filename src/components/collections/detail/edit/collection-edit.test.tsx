jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import { getCollectionPromptIds } from "@/data/actions/collection";
import { getPromptsPage } from "@/data/actions/prompt";

import { CollectionEdit } from "./collection-edit";

const getCollectionPromptIdsMock =
   getCollectionPromptIds as jest.MockedFunction<typeof getCollectionPromptIds>;

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
>;

const assertRendered = () => {
   const edit = screen.getByTestId("collection-edit");
   const breadcrumbs = screen.getByTestId("collection-breadcrumb");

   assertInDocument(edit);
   assertInDocument(breadcrumbs);
};

const assertCreateModeRendered = () => {
   const editForm = screen.getByTestId("collection-edit-form");
   const tabs = screen.queryByTestId("mock-react-tabs-root");

   assertInDocument(editForm);
   assertNotInDocument(tabs);
};

const assertEditModeRendered = () => {
   const tabs = screen.getByTestId("mock-react-tabs-root");
   const tabGeneral = screen.getByTestId("tab-general-btn");
   const tabTemplates = screen.getByTestId("tab-templates-btn");
   const tabOther = screen.getByTestId("tab-other-btn");

   assertInDocument(tabs);
   assertInDocument(tabGeneral);
   assertInDocument(tabTemplates);
   assertInDocument(tabOther);
};

const assertGeneralTabRendered = () => {
   const editForm = screen.getByTestId("collection-edit-form");
   const prompts = screen.queryByTestId("collection-prompts");
   const other = screen.queryByTestId("collection-other");

   assertInDocument(editForm);
   assertNotInDocument(prompts);
   assertNotInDocument(other);
};

const assertTemplatesTabRendered = () => {
   const prompts = screen.getByTestId("collection-prompts");
   const editForm = screen.queryByTestId("collection-edit-form");
   const other = screen.queryByTestId("collection-other");

   assertInDocument(prompts);
   assertNotInDocument(editForm);
   assertNotInDocument(other);
};

const assertOtherTabRendered = () => {
   const other = screen.getByTestId("collection-other");
   const editForm = screen.queryByTestId("collection-edit-form");
   const prompts = screen.queryByTestId("collection-prompts");

   assertInDocument(other);
   assertNotInDocument(editForm);
   assertNotInDocument(prompts);
};

describe("CollectionEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("create mode - test", async () => {
      const { container } = renderWithReactQuery(<CollectionEdit />);

      await waitFor(() => {
         assertRendered();
         assertCreateModeRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit mode - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = renderWithReactQuery(
         <CollectionEdit collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertEditModeRendered();
         assertGeneralTabRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionEdit functionality tests", () => {
   beforeAll(() => {
      const promptIds = dtestData.dCollectionPromptIds();
      getCollectionPromptIdsMock.mockResolvedValue(promptIds);

      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("tab switching - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithReactQuery(<CollectionEdit collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertEditModeRendered();
         assertGeneralTabRendered();
      });

      const tabTemplates = screen.getByTestId("tab-templates-btn");
      userEvent.click(tabTemplates);

      await waitFor(() => {
         assertTemplatesTabRendered();
      });

      const tabOther = screen.getByTestId("tab-other-btn");
      userEvent.click(tabOther);

      await waitFor(() => {
         assertOtherTabRendered();
      });

      const tabGeneral = screen.getByTestId("tab-general-btn");
      userEvent.click(tabGeneral);

      await waitFor(() => {
         assertGeneralTabRendered();
      });
   });
});
