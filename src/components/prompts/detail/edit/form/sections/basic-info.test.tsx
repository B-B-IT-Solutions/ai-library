import { useInfiniteQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { assertInDocument } from "@tests";
import { FormProvider, useForm } from "react-hook-form";

import { BasicInfo } from "./basic-info";

jest.mock("@tanstack/react-query", () => ({
   ...jest.requireActual("@tanstack/react-query"),
   useInfiniteQuery: jest.fn(),
}));

const mockUseInfiniteQuery = useInfiniteQuery as jest.Mock;

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
      mockUseInfiniteQuery.mockReturnValue({
         data: { pages: [{ content: ["Marketing", "Support"] }] },
         fetchNextPage: jest.fn(),
         hasNextPage: false,
         isFetching: false,
         isLoading: false,
      });
   });

   it("rendered - test", () => {
      const { container } = render(<TestWrapper />);

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
