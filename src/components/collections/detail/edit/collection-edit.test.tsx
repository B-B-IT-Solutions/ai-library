jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");

import { screen, waitFor, within } from "@testing-library/react";
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

const assertHeaderActionsRendered = () => {
   const headerActions = screen.getByTestId("header-actions");
   assertInDocument(within(headerActions).getByTestId("cancel-btn"));
};

const assertCreateModeRendered = () => {
   const editForm = screen.getByTestId("collection-edit-form");
   const tabs = screen.getByTestId("mock-react-tabs-root");
   const tabTemplates = screen.getByTestId("tab-templates-btn");
   const tabOther = screen.getByTestId("tab-other-btn");

   assertInDocument(editForm);
   assertInDocument(tabs);
   expect(tabTemplates).toBeDisabled();
   expect(tabOther).toBeDisabled();
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
   expect(tabTemplates).not.toBeDisabled();
   expect(tabOther).not.toBeDisabled();
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
         assertHeaderActionsRendered();
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
         assertHeaderActionsRendered();
         assertEditModeRendered();
         assertGeneralTabRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionEdit navigation tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("create mode - cancel btn navigates to /collections - test", async () => {
      renderWithReactQuery(<CollectionEdit />);

      await waitFor(() => assertRendered());

      const headerActions = screen.getByTestId("header-actions");
      const cancelBtn = within(headerActions).getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(cancelBtn.closest("a")).toHaveAttribute("href", "/collections");
      });
   });

   it("edit mode - cancel btn navigates to collection view - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithReactQuery(<CollectionEdit collection={collection} />);

      await waitFor(() => assertRendered());

      const headerActions = screen.getByTestId("header-actions");
      const cancelBtn = within(headerActions).getByTestId("cancel-btn");

      await waitFor(() => {
         expect(cancelBtn.closest("a")).toHaveAttribute(
            "href",
            `/collections/${collection.id}`
         );
      });
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
