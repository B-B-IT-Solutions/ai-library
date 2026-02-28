jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";

import { getGlobalTemplateFields } from "@/data/actions/settings";

import { GlobalTemplateFields } from "./template-fields";

const getGlobalTemplateFieldsMock =
   getGlobalTemplateFields as jest.MockedFunction<
      typeof getGlobalTemplateFields
   >;

const assertRendered = () => {
   const tempalteFields = screen.getByTestId("template-fields");
   assertInDocument(tempalteFields);
};

const assertFieldsRendered = () => {
   const addBtn = screen.getByTestId("add-template-field-btn");
   const items = screen.getAllByTestId("template-field-item");

   assertInDocument(addBtn);
   expect(items).toHaveLength(3);
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
      getGlobalTemplateFieldsMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(GlobalTemplateFields, {});

      await waitFor(() => {
         assertRendered();
         assertEmptyStateRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("TemplateFields - fields retrieved - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      getGlobalTemplateFieldsMock.mockResolvedValue(fields);

      const { container } = await renderAsyncRSC(GlobalTemplateFields, {});

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertEmptyStateNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
