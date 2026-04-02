import { FC } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import {
   LibraryEntryFilterContext,
   LibraryEntryFiltersHelper,
} from "./filters-context";
import { ModelsFilter } from "./models-filter";

const filtersHelper = new LibraryEntryFiltersHelper({});

type WrapperProps = {
   models: string[];
};

const TestWrapper: FC<WrapperProps> = ({ models }) => {
   return (
      <LibraryEntryFilterContext.Provider value={filtersHelper}>
         <ModelsFilter models={models} />
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
      const getModelsFn = mockGetModels([]);

      const { container } = renderWithRouter(<TestWrapper models={[]} />);

      await waitFor(() => {
         assertCategoriesEmptyRendered();
         expect(getModelsFn).toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("ModelsFilter - f_models mod-1 - test", async () => {
      const models = dtestData.dTemplateModels();
      const getModelsFn = mockGetModels(["mod-1"]);

      const { container } = renderWithRouter(<TestWrapper models={models} />);

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
      const models = dtestData.dTemplateModels();
      const getModelsFn = mockGetModels([]);
      const setModelsFn = mockSetModels();

      renderWithRouter(<TestWrapper models={models} />);

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
      const models = dtestData.dTemplateModels();
      const getModelsFn = mockGetModels(["mod-1"]);
      const setModelsFn = mockSetModels();

      renderWithRouter(<ModelsFilter models={models} />);

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
