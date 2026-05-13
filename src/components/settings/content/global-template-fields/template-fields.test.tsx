jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";

import { getGlobalPromptFields } from "@/data/actions/settings";

import { GlobalPromptFields } from "./template-fields";

const getGlobalPromptFieldsMock =
   getGlobalPromptFields as jest.MockedFunction<
      typeof getGlobalPromptFields
   >;

const assertRendered = () => {
   const fields = screen.getByTestId("template-fields");
   assertInDocument(fields);
};

const assertFieldsRendered = () => {
   const addBtn = screen.getByTestId("add-template-field-btn");
   const fieldItems = screen.getAllByTestId("template-field");

   assertInDocument(addBtn);
   expect(fieldItems).toHaveLength(3);
};

const assertEmptyStateRendered = () => {
   const empty = screen.getByTestId("fields-empty");
   assertInDocument(empty);
};

const assertEmptyStateNotRendered = () => {
   const empty = screen.queryByTestId("fields-empty");
   assertNotInDocument(empty);
};

describe("TemplateFields rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("TemplateFields - fields empty - test", async () => {
      getGlobalPromptFieldsMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(GlobalPromptFields, {});

      await waitFor(() => {
         assertRendered();
         assertEmptyStateRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("TemplateFields - fields retrieved - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      getGlobalPromptFieldsMock.mockResolvedValue(fields);

      const { container } = await renderAsyncRSC(GlobalPromptFields, {});

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertEmptyStateNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
