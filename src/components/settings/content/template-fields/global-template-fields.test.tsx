jest.mock("@/data/actions/settings");

import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";

import { getGlobalFields } from "@/data/actions/settings";

import { GlobalTemplateFields } from "./global-template-fields";

const getGlobalFieldsMock = getGlobalFields as jest.MockedFunction<
   typeof getGlobalFields
>;

const assertRendered = () => {
   const tempalteFields = screen.getByTestId("global-template-fields");
   const fieldsList = screen.getByTestId("global-fields-list");

   assertInDocument(tempalteFields);
   assertInDocument(fieldsList);
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
      getGlobalFieldsMock.mockResolvedValue([]);

      const { container } = await renderAsyncRSC(GlobalTemplateFields, {});

      await waitFor(() => {
         assertRendered();
         assertEmptyStateRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("TemplateFields - fields retrieved - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      getGlobalFieldsMock.mockResolvedValue(fields);

      const { container } = await renderAsyncRSC(GlobalTemplateFields, {});

      await waitFor(() => {
         assertRendered();
         assertEmptyStateNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
