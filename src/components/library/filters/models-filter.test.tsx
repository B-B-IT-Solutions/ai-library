jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { getLibraryModels } from "@/data/actions/library";

import { ModelsFilter } from "./models-filter";

const getLibraryModelsMock = getLibraryModels as jest.MockedFunction<
   typeof getLibraryModels
>;

const assertRendered = () => {
   const filter = screen.getByTestId("models-filter");
   assertInDocument(filter);
};

const assertCategoriesEmptyRendered = () => {
   const empty = screen.getByTestId("models-empty");
   assertInDocument(empty);
};

describe("ModelsFilter rendering tests", () => {
   it("ModelsFilter - models empty - test", async () => {
      getLibraryModelsMock.mockResolvedValue([]);

      const url = "/library";
      const searchParams = "";
      const { container } = renderWithRouter(
         <ModelsFilter />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertCategoriesEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ModelsFilter - f_models mod-1 - test", async () => {
      const models = ["mod-1", "mod-2", "mod-3"];
      getLibraryModelsMock.mockResolvedValue(models);

      const url = "/library";
      const searchParams = "f_models=mod-1";
      const { container } = renderWithRouter(
         <ModelsFilter />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ModelsFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("ModelsFilter - model selected - test", async () => {
      const models = ["mod-1", "mod-2", "mod-3"];
      getLibraryModelsMock.mockResolvedValue(models);

      const url = "/library";
      const searchParams = "";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<ModelsFilter />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("model-mod-1");
      await userEvent.click(cat1);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?f_models=mod-1",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("ModelsFilter - model unselected - test", async () => {
      const models = ["mod-1", "mod-2", "mod-3"];
      getLibraryModelsMock.mockResolvedValue(models);

      const url = "/library";
      const searchParams = "f_models=mod-1";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<ModelsFilter />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("model-mod-1");
      await userEvent.click(cat1);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
