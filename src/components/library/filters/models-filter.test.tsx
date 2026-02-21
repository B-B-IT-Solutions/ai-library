jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { getLibraryModels } from "@/data/actions/library";

import {
   LibraryEntryFilterContext,
   LibraryEntryFiltersHelper,
} from "./filters-context";
import { ModelsFilter } from "./models-filter";

const getLibraryModelsMock = getLibraryModels as jest.MockedFunction<
   typeof getLibraryModels
>;

const filtersHelper = new LibraryEntryFiltersHelper({});

const TestWrapper = () => {
   return (
      <LibraryEntryFilterContext.Provider value={filtersHelper}>
         <ModelsFilter />
      </LibraryEntryFilterContext.Provider>
   );
};

const mockGetModels = (values: string[]) => {
   return jest
      .spyOn(LibraryEntryFiltersHelper.prototype, "getModels")
      .mockImplementation(() => values);
};

const mockSetModels = () => {
   return jest.spyOn(LibraryEntryFiltersHelper.prototype, "setModels");
};

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
      const getModelsFn = mockGetModels([]);

      const { container } = renderWithRouter(<TestWrapper />);

      await waitFor(() => {
         assertCategoriesEmptyRendered();
         expect(getModelsFn).toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("ModelsFilter - f_models mod-1 - test", async () => {
      const models = ["mod-1", "mod-2", "mod-3"];
      getLibraryModelsMock.mockResolvedValue(models);
      const getModelsFn = mockGetModels(["mod-1"]);

      const { container } = renderWithRouter(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         expect(getModelsFn).toHaveBeenCalled();
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
      const getModelsFn = mockGetModels([]);
      const setModelsFn = mockSetModels();

      renderWithRouter(<TestWrapper />);

      await waitFor(() => {
         assertRendered();
         expect(getModelsFn).toHaveBeenCalled();
         expect(setModelsFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("model-mod-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         expect(setModelsFn).toHaveBeenCalledTimes(1);
         expect(setModelsFn).toHaveBeenCalledWith(["mod-1"]);
      });
   });

   it("ModelsFilter - model unselected - test", async () => {
      const models = ["mod-1", "mod-2", "mod-3"];
      getLibraryModelsMock.mockResolvedValue(models);
      const getModelsFn = mockGetModels(["mod-1"]);
      const setModelsFn = mockSetModels();

      renderWithRouter(<ModelsFilter />);

      await waitFor(() => {
         assertRendered();
         expect(getModelsFn).toHaveBeenCalled();
         expect(setModelsFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("model-mod-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         expect(setModelsFn).toHaveBeenCalledTimes(1);
         expect(setModelsFn).toHaveBeenCalledWith([]);
      });
   });
});
