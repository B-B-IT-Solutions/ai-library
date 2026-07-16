jest.mock("@/data/actions/prompt");

import { screen } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import {
   getPromptCategoriesPage,
   getPromptModelsPage,
} from "@/data/actions/prompt";

import { BasicInfo } from "./basic-info";

const getPromptCategoriesPageMock =
   getPromptCategoriesPage as jest.MockedFunction<
      typeof getPromptCategoriesPage
   >;
const getPromptModelsPageMock = getPromptModelsPage as jest.MockedFunction<
   typeof getPromptModelsPage
>;

const TestWrapper = () => {
   const form = useForm({
      defaultValues: {
         title: "",
         description: "",
         content: "",
         recommendedModel: "Claude",
         categories: [],
         fields: [],
         globalFieldIds: [],
      },
   });

   return (
      <FormProvider {...form}>
         <BasicInfo control={form.control} />
      </FormProvider>
   );
};

const assertRendered = () => {
   const field = screen.getByTestId("basic-info");
   const title = screen.getByTestId("title");
   const description = screen.getByTestId("description");
   const recommendedModel = screen.getByTestId("recommendedModel");
   const categories = screen.getByTestId("categories");

   assertInDocument(field);
   assertInDocument(title);
   assertInDocument(description);
   assertInDocument(recommendedModel);
   assertInDocument(categories);
};

describe("BasicInfo rendering tests", () => {
   beforeEach(() => {
      const page = dtestData.dPromptCategoriesPage();
      getPromptCategoriesPageMock.mockResolvedValue(page);

      const modelsPage = dtestData.dPromptModelsPage();
      getPromptModelsPageMock.mockResolvedValue(modelsPage);
   });

   it("rendered - test", () => {
      const { container } = renderWithReactQuery(<TestWrapper />);

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
